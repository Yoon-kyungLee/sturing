import connectDB from "@/lib/database/db";
import { Application } from "@/schema/applicationSchema";
import { TeamMembers } from "@/schema/teamMemberSchema";
import { User } from "@/schema/userSchema";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const applicationId = params.id;
  connectDB();

  try {
    // 1. 지원서 조회
    const application = await Application.findById(applicationId);
    if (!application) {
      return new Response("Application not found", { status: 404 });
    }

    // 2. 지원서 유저 닉네임 추가
    const { userId } = application;

    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const userNickname = user.nickname;

    const teamMember = await TeamMembers.findOne({ studyId: application.studyId });

    const updatedApplication = {
      _id: application._id,
      studyId: application.studyId,
      userId: application.userId,
      userNickname: userNickname,
      title: application.title,
      resolution: application.resolution,
      role: application.role,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      status: teamMember.members[0].status,
    };

    return new Response(JSON.stringify(updatedApplication), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
