import React, { useEffect, useState } from "react";
import { getAllDashboard } from "../../services/dashboardApi/dashboardApi";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import  Loader  from "../../components/ui/loader";
import { FaBuilding, FaUsers, FaFileContract, FaExclamationTriangle, FaDoorClosed } from "react-icons/fa";

const DashboardHome: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const data = await getAllDashboard();
                setDashboardData(data);
                
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
            setLoading(false);
        };
        fetchDashboard();
    }, []);
    const summaryItems = [
        { title: "Tòa nhà", value: dashboardData?.building || 0, icon: <FaBuilding />, color: "text-blue-500" },
        { title: "Khách hàng", value: dashboardData?.customer || 0, icon: <FaUsers />, color: "text-green-500" },
        { title: "Hợp đồng", value: dashboardData?.contract || 0, icon: <FaFileContract />, color: "text-yellow-500" },
        { title: "Vấn đề", value: dashboardData?.problem || 0, icon: <FaExclamationTriangle />, color: "text-red-500" },
        { title: "Phòng", value: dashboardData?.room || 0, icon: <FaDoorClosed />, color: "text-cyan-500" },
    ];

    return (
        <div className="container mx-auto p-6 mt-12">
            <h1 className="text-3xl font-semibold text-blue-500 text-center mb-4">
                Welcome to Rental Management Dashboard
            </h1>
            <p className="text-center text-gray-600 mb-8">
                Overview of your rental management system
            </p>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summaryItems.map((item, index) => (
                        <Card key={index} className="shadow hover:shadow-lg transition duration-200">
                            <CardHeader className="flex items-center">
                                <div className={`text-4xl ${item.color} mr-4`}>{item.icon}</div>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-800">{item.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
