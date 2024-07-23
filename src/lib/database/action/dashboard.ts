"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../getSession";
import { useDashboardTeamStore } from "@/store/dashboardTeamStore";

export const toggleFunctionIsActive = async (formData: FormData) => {
  const session = await getSession();
  const userId = session?.user?.id;
  const functionType = formData.get("functionType");
  const dashboardId = formData.get("dashboardId");
  const studyId = formData.get("studyId");

  try {
    const response = await fetch(`${process.env.LOCAL_URL}/api/dashboard/toggle-function-isactive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ functionType, dashboardId, userId }),
    });

    if (!response.ok) {
      throw new Error("기능 활성 상태 변경 실패");
    }

    const path = `/study/${studyId}/dashboard`;
    revalidatePath(path);
  } catch (error) {
    console.log("error", error);
  }
};

export const setIsEditingAction = (formData: FormData) => {
  const studyId = formData.get("studyId");
  useDashboardTeamStore.getState().setIsEditing();

  const path = `/study/${studyId}/dashboard`;
  revalidatePath(path, "layout");
};

export const checkAttendanceAction = async (formData: FormData) => {
  const dashboardId = formData.get("dashboardId");
  const studyId = formData.get("studyId");
  const date = formData.get("date");

  const session = await getSession();
  const userId = session?.user?.id;

  try {
    const response = await fetch(`${process.env.LOCAL_URL}/api/dashboard/check-attendance`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dashboardId, userId, date }),
    });

    if (!response.ok) {
      throw new Error("출석 상태 변경 실패");
    }

    revalidatePath(`/study/${studyId}/dashboard`);
  } catch (error) {
    console.log("error", error);
  }
};