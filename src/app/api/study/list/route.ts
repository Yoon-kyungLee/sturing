import connectDB from "@/lib/database/db";
import { Study } from "@/schema/studySchema";
import { TeamMembers } from "@/schema/teamMemberSchema";
import { TStudyListData } from "@/types/api/study";
import categoryMap from "@/utils/categoryMap";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.split(",");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "LATEST";
  const role = searchParams.get("role")?.split(",");
  const age = searchParams.get("age")?.split(",");
  const career = searchParams.get("career")?.split(",");
  const memberCount = searchParams.get("memberCount");
  const location = searchParams.get("location")?.split(",");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  //헤더로 유저정보 받기 (북마크 여부 확인)

  await connectDB();

  //쿼리 설정
  let query: { [key: string]: any } = { status: "RECRUIT_START" };

  if (category) {
    query.category = { $in: category };
  }

  if (search) {
    const mappedCategory = categoryMap[search];
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: mappedCategory || { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    query["wantedMember.role"] = { $in: role };
  }

  if (age) {
    query["wantedMember.age"] = { $in: age };
  }

  if (career) {
    query["wantedMember.career"] = { $in: career };
  }

  if (memberCount) {
    query["wantedMember.count"] = { $in: memberCount };
  }

  if (location) {
    query["$or"] = location.map((loc) => ({
      "meeting.location": { $regex: `^${loc}$`, $options: "i" },
    }));
  }
  //정렬 설정
  let sortOption: { [key: string]: any } = {};

  if (sortBy === "LATEST") {
    sortOption = { createdAt: -1 };
  } else if (sortBy === "DEADLINE") {
    sortOption = { startDate: 1, createdAt: 1 };
  } else if (sortBy === "POPULAR") {
    sortOption = { popularScore: -1, createdAt: 1 };
  }

  try {
    let studyListData;

    if (sortBy === "POPULAR") {
      studyListData = await Study.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "teammembers",
            localField: "_id",
            foreignField: "studyId",
            as: "teamMembersData",
          },
        },
        {
          $lookup: {
            from: "recruitcomments",
            localField: "_id",
            foreignField: "studyId",
            as: "commentsData",
          },
        },
        {
          $addFields: {
            teamMembersCount: { $size: { $ifNull: ["$teamMembersData.members", []] } },
            commentsCount: { $size: { $ifNull: ["$commentsData", []] } },
            scrapCount: { $ifNull: ["$scrapCount", 0] },
          },
        },
        {
          $addFields: {
            popularScore: { $add: ["$scrapCount", "$teamMembersCount", "$commentsCount"] },
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "ownerId",
            foreignField: "_id",
            as: "ownerData",
          },
        },
        {
          $match: {
            ownerData: { $ne: [] },
          },
        },
        { $sort: sortOption },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
        {
          $project: {
            teamMembersData: 0,
            commentsData: 0,
            teamMembersCount: 0,
            commentsCount: 0,
            popularScore: 0,
          },
        },
      ]);
    } else {
      studyListData = await Study.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "ownerId",
            foreignField: "_id",
            as: "ownerData",
          },
        },
        {
          $match: {
            ownerData: { $ne: [] },
          },
        },
        { $sort: sortOption },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ]);
    }

    let studyList: TStudyListData = [];

    //isBookmark 추가 예정.
    if (studyListData) {
      studyList = await Promise.all(
        studyListData.map(async (study) => {
          const { _id, ownerId, category, title, imageUrl, startDate, endDate, meeting, wantedMember } = study;
          const acceptedTeamMembers = await TeamMembers.findOne({ studyId: _id, "members.status": "ACCEPTED" });
          const acceptedCount = acceptedTeamMembers ? acceptedTeamMembers.members.length : 0;
          const wantedMemberCount = wantedMember?.count || "제한없음";
          return {
            id: _id.toString(),
            ownerId,
            category,
            title,
            imageUrl,
            startDate,
            endDate,
            meeting,
            wantedMemberCount,
            acceptedTeamMemberCount: acceptedCount,
          };
        }),
      );
    }

    const totalStudies = (await Study.find(query).populate({ path: "ownerId" }).exec()).filter(
      (study) => study.ownerId !== null,
    );
    const totalStudiesCount = totalStudies.length;

    const totalPages = Math.ceil(totalStudiesCount / pageSize);
    const hasNextPage = totalPages > page;

    return Response.json({ studyList, totalPages, currentPage: page, pageSize, hasNextPage });
  } catch (error: any) {
    console.error("error study list", error);
    return Response.json({ error }, { status: 500 });
  }
}
