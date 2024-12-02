import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building, Room, ServiceMeterReadings } from '@/types/types';
import useAuthStore from '@/stores/userStore';
import { getServicemeterByRoomId } from '@/services/roomStatementApi/roomStatementApi';
import useServiceMeterReadingsStore from '@/stores/roomStatementStore';
import { toast } from "@/hooks/use-toast";

interface MeterReadingFormProps {
    onSubmit: (meterReading: ServiceMeterReadings) => void;
    onCancel: () => void;
    building: Building | null;  
    room: Room | null;          
}

const MeterReadingForm: React.FC<MeterReadingFormProps> = ({ onSubmit, onCancel, building, room }) => {
    if (!building || !room) {
        return (
            <div className="text-center text-red-500 p-4">
                Vui lòng chọn tòa nhà và phòng trước.
            </div>
        );
    }

    const userInfo = useAuthStore.getState().userData;
    const reading = useServiceMeterReadingsStore.getState().reading;

    const [meterReading, setMeterReading] = useState<ServiceMeterReadings>({
        id: '9c09af3b-111e-4362-ba48-0b9a0ec255a1',
        building_name: building.building_name || '',
        building_id: building.id,
        room_name: room.room_name || '',
        room_id: room.id,
        status: 0,
        recorded_by: userInfo?.lastName || '',
        recordid: userInfo?.id || '',
        record_date: new Date(),
        electricity_old: 0,
        electricity_new: 0,
        electricity_price: 0,
        electricity_cost: 0,
        water_old: 0,
        water_new: 0,
        water_price: 0,
        water_cost: 0,
        confirmation_status: false,
        total_amount: 0,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        getInitialData();
    }, []);

    useEffect(() => {
        if (reading) {
            setMeterReading((prevState) => ({
                ...prevState,
                electricity_price: reading.electricity_price || 0,
                water_price: reading.water_price || 0,
                electricity_old: reading.electricity_new,
                water_old: reading.water_new
            }));
        }
    }, [reading]);

    const getInitialData = async () => {
        try {
            await getServicemeterByRoomId(room.id);
        } catch (error) {
            console.error("Error fetching initial data:", error);
            toast({
                title: "Lỗi",
                description: "Không thể tải dữ liệu ban đầu. Vui lòng thử lại!",
                type: "background",
            });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMeterReading((prevState) => ({
            ...prevState,
            [name]: name.includes('price') || name.includes('status') || name.includes('id') || name.includes('recordid') || name.includes('record_date') 
                ? parseFloat(value) || 0 
                : value,
        }));
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (meterReading.electricity_new < meterReading.electricity_old) {
            newErrors.electricity_new = "Chỉ số mới không được nhỏ hơn chỉ số cũ.";
        }
        if (meterReading.water_new < meterReading.water_old) {
            newErrors.water_new = "Chỉ số mới không được nhỏ hơn chỉ số cũ.";
        }
        if (meterReading.electricity_price <= 0) {
            newErrors.electricity_price = "Giá tiền phải lớn hơn 0.";
        }
        if (meterReading.water_price <= 0) {
            newErrors.water_price = "Giá tiền phải lớn hơn 0.";
        }
        if (!meterReading.record_date) {
            newErrors.record_date = "Ngày ghi chỉ số không được để trống.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(meterReading);
            toast({
                title: "Thành công",
                description: "Ghi chỉ số đồng hồ thành công!",
                type: "foreground",
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast({
                title: "Lỗi",
                description: "Không thể ghi chỉ số. Vui lòng thử lại!",
                type:"foreground",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full border-none shadow-none bg-white">
            <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-3xl text-gray-800 font-semibold text-center">
                    Nhập Chỉ Số Đồng Hồ
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <Tabs defaultValue="electricity" className="w-full">
                        <TabsList className="flex space-x-4 mb-8">
                            <TabsTrigger 
                                value="electricity" 
                                className="flex-1 py-2 text-center text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 transition duration-200"
                            >
                                Đọc Công Tơ Điện
                            </TabsTrigger>
                            <TabsTrigger 
                                value="water" 
                                className="flex-1 py-2 text-center text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 transition duration-200"
                            >
                                Đọc Công Tơ Nước
                            </TabsTrigger>
                        </TabsList>
                        
                        <ScrollArea className="h-96 w-full rounded-md border border-gray-200 p-6 mb-8">
                            <TabsContent value="electricity">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col">
                                            <Label htmlFor="electricity_old" className="mb-2 text-gray-700 font-medium">Chỉ Số Cũ</Label>
                                            <Input
                                                id="electricity_old"
                                                name="electricity_old"
                                                type="number"
                                                placeholder="Nhập chỉ số cũ"
                                                value={meterReading.electricity_old}
                                                onChange={handleChange}
                                                className={`border ${errors.electricity_old ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:ring-blue-500`}
                                                aria-invalid={!!errors.electricity_old}
                                                aria-describedby={errors.electricity_old ? "electricity_old-error" : undefined}
                                            />
                                            {errors.electricity_old && (
                                                <span id="electricity_old-error" className="text-red-500 text-sm mt-1">
                                                    {errors.electricity_old}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            <Label htmlFor="electricity_new" className="mb-2 text-gray-700 font-medium">Chỉ Số Mới</Label>
                                            <Input
                                                id="electricity_new"
                                                name="electricity_new"
                                                type="number"
                                                placeholder="Nhập chỉ số mới"
                                                value={meterReading.electricity_new}
                                                onChange={handleChange}
                                                className={`border ${errors.electricity_new ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:ring-blue-500`}
                                                aria-invalid={!!errors.electricity_new}
                                                aria-describedby={errors.electricity_new ? "electricity_new-error" : undefined}
                                            />
                                            {errors.electricity_new && (
                                                <span id="electricity_new-error" className="text-red-500 text-sm mt-1">
                                                    {errors.electricity_new}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            <Label htmlFor="electricity_price" className="mb-2 text-gray-700 font-medium">Giá Tiền (VNĐ)</Label>
                                            <Input
                                                id="electricity_price"
                                                name="electricity_price"
                                                type="number"
                                                placeholder="Nhập giá tiền mỗi đơn vị"
                                                value={meterReading.electricity_price}
                                                onChange={handleChange}
                                                className={`border ${errors.electricity_price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:ring-blue-500`}
                                                aria-invalid={!!errors.electricity_price}
                                                aria-describedby={errors.electricity_price ? "electricity_price-error" : undefined}
                                            />
                                            {errors.electricity_price && (
                                                <span id="electricity_price-error" className="text-red-500 text-sm mt-1">
                                                    {errors.electricity_price}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                                        <h4 className="font-semibold text-gray-700 mb-2">Tóm Tắt Mức Tiêu Thụ</h4>
                                        <div className="flex justify-between">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Đơn Vị Tiêu Thụ:</span> {meterReading.electricity_new - meterReading.electricity_old}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Tổng Chi Phí:</span> {new Intl.NumberFormat("vi-VN").format((meterReading.electricity_new - meterReading.electricity_old) * meterReading.electricity_price)} VNĐ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="water">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col">
                                            <Label htmlFor="water_old" className="mb-2 text-gray-700 font-medium">Chỉ Số Cũ</Label>
                                            <Input
                                                id="water_old"
                                                name="water_old"
                                                type="number"
                                                placeholder="Nhập chỉ số cũ"
                                                value={meterReading.water_old}
                                                onChange={handleChange}
                                                className={`border ${errors.water_old ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:ring-blue-500`}
                                                aria-invalid={!!errors.water_old}
                                                aria-describedby={errors.water_old ? "water_old-error" : undefined}
                                            />
                                            {errors.water_old && (
                                                <span id="water_old-error" className="text-red-500 text-sm mt-1">
                                                    {errors.water_old}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            <Label htmlFor="water_new" className="mb-2 text-gray-700 font-medium">Chỉ Số Mới</Label>
                                            <Input
                                                id="water_new"
                                                name="water_new"
                                                type="number"
                                                placeholder="Nhập chỉ số mới"
                                                value={meterReading.water_new}
                                                onChange={handleChange}
                                                className={`border ${errors.water_new ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:ring-blue-500`}
                                                aria-invalid={!!errors.water_new}
                                                aria-describedby={errors.water_new ? "water_new-error" : undefined}
                                            />
                                            {errors.water_new && (
                                                <span id="water_new-error" className="text-red-500 text-sm mt-1">
                                                    {errors.water_new}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            <Label htmlFor="water_price" className="mb-2 text-gray-700 font-medium">Giá Tiền (VNĐ)</Label>
                                            <Input
                                                id="water_price"
                                                name="water_price"
                                                type="number"
                                                placeholder="Nhập giá tiền mỗi đơn vị"
                                                value={meterReading.water_price}
                                                onChange={handleChange}
                                                className={`border ${errors.water_price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:ring-blue-500`}
                                                aria-invalid={!!errors.water_price}
                                                aria-describedby={errors.water_price ? "water_price-error" : undefined}
                                            />
                                            {errors.water_price && (
                                                <span id="water_price-error" className="text-red-500 text-sm mt-1">
                                                    {errors.water_price}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                                        <h4 className="font-semibold text-gray-700 mb-2">Tóm Tắt Mức Tiêu Thụ</h4>
                                        <div className="flex justify-between">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Đơn Vị Tiêu Thụ:</span> {meterReading.water_new - meterReading.water_old}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Tổng Chi Phí:</span> {new Intl.NumberFormat("vi-VN").format((meterReading.water_new - meterReading.water_old) * meterReading.water_price)} VNĐ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </ScrollArea>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <Label htmlFor="record_date" className="mb-2 text-gray-700 font-medium">Ngày Ghi Chỉ Số</Label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            id="record_date"
                                            name="record_date"
                                            value={meterReading.record_date.toISOString().split('T')[0]}
                                            onChange={handleChange}
                                            className={`border ${errors.record_date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:ring-blue-500 pl-10`}
                                            aria-invalid={!!errors.record_date}
                                            aria-describedby={errors.record_date ? "record_date-error" : undefined}
                                        />
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                    {errors.record_date && (
                                        <span id="record_date-error" className="text-red-500 text-sm mt-1">
                                            {errors.record_date}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex flex-col">
                                    <Label htmlFor="status" className="mb-2 text-gray-700 font-medium">Trạng Thái</Label>
                                    <Input
                                        id="status"
                                        name="status"
                                        type="number"
                                        value={meterReading.status}
                                        onChange={handleChange}
                                        className={`border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:ring-blue-500`}
                                        aria-invalid={!!errors.status}
                                        aria-describedby={errors.status ? "status-error" : undefined}
                                    />
                                    {errors.status && (
                                        <span id="status-error" className="text-red-500 text-sm mt-1">
                                            {errors.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-4">
                                <Button 
                                    type="button"
                                    onClick={onCancel} 
                                    variant="outline" 
                                    className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors duration-200 rounded-md"
                                    aria-label="Hủy"
                                >
                                    Hủy
                                </Button>
                                <Button 
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-md"
                                    disabled={isSubmitting}
                                    aria-label="Lưu"
                                >
                                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </div>
                        </div>
                    </Tabs>
                </form>
            </CardContent>
        </Card>
    );
};

export default MeterReadingForm;
