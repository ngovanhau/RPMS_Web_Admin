import { useProblemStore } from "@/stores/problemStore";
import api from "../axios";
import { Problem } from "@/types/types";

// Fetch tất cả các vấn đề từ server và cập nhật store
export const fetchAllProblems = async () => {
  try {
    const response = await api.get("/problem/problemall");
    const problems: Problem[] = response.data.data;
    useProblemStore.getState().setProblems(problems);
    return problems;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vấn đề:", error);
    throw error;
  }
};

// Tạo một vấn đề mới và thêm vào store
export const createProblem = async (problemData: Problem) => {
  try {
    const response = await api.post("/problem/create", problemData);
    const newProblem: Problem = response.data.data;
    useProblemStore.getState().addProblem(newProblem);
    return newProblem;
  } catch (error) {
    console.error("Lỗi khi tạo vấn đề:", error);
    throw error;
  }
};

// Cập nhật một vấn đề bằng ID và đồng bộ với store
export const updateProblemById = async (id: string, problem: Problem) => {
  try {
    const response = await api.put(`/problem/update?id=${id}`, problem);
    useProblemStore.getState().updateProblem(id, problem);
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật vấn đề:", error);
    throw error;
  }
};


// Xóa một vấn đề bằng ID và cập nhật store
export const deleteProblemById = async (id: string) => {
  try {
    await api.delete(`/problem/delete?id=${id}`);
    useProblemStore.getState().removeProblem(id);
  } catch (error) {
    console.error("Lỗi khi xóa vấn đề:", error);
    throw error;
  }
};

// Lấy một vấn đề bằng ID từ server và cập nhật `currentProblem` trong store
export const fetchProblemById = async (id: string) => {
  try {
    const response = await api.get(`/problem/getproblembyid?id=${id}`);
    const problem: Problem = response.data.data;
    useProblemStore.getState().setCurrentProblem(problem);
    return problem;
  } catch (error) {
    console.error("Lỗi khi lấy vấn đề theo ID:", error);
    throw error;
  }
};

// Lấy các vấn đề theo Room ID và cập nhật store
export const fetchProblemsByRoomId = async (roomId: string) => {
  try {
    const response = await api.get(`/problem/getproblembyroomid?id=${roomId}`);
    const problems: Problem[] = response.data.data;
    useProblemStore.getState().setProblems(problems);
    return problems;
  } catch (error) {
    console.error("Lỗi khi lấy vấn đề theo Room ID:", error);
    throw error;
  }
};

export const fetchProblemByBuildingId = async ( buildingId : string ) => {
  try {
    useProblemStore.getState().clearProblems()
    const response = await api.get(`/problem/getproblembybuildingid?id=${buildingId}`)
    useProblemStore.getState().setProblems(response?.data.data)
    console.log(response.data.data)
  } catch (error) {
    console.log(error)
  }
}
