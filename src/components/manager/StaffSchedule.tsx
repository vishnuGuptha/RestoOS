import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { 
  Users, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { getRoleColor } from '@/data/mockData';

interface Shift {
  id: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  role: string;
}

const mockShifts: Shift[] = [
  { id: '1', userId: '3', date: new Date(), startTime: '08:00', endTime: '16:00', role: 'chef' },
  { id: '2', userId: '4', date: new Date(), startTime: '10:00', endTime: '18:00', role: 'waiter' },
  { id: '3', userId: '6', date: new Date(), startTime: '12:00', endTime: '20:00', role: 'waiter' },
  { id: '4', userId: '5', date: new Date(), startTime: '14:00', endTime: '22:00', role: 'cashier' },
];

export function StaffSchedule() {
  const { users } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const staffUsers = users.filter(u => u.role !== 'admin');
  
  const todayShifts = mockShifts.filter(shift => 
    shift.date.toDateString() === selectedDate.toDateString()
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getShiftForUser = (userId: string) => {
    return todayShifts.find(s => s.userId === userId);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Schedule</h2>
          <p className="text-gray-500">Manage employee shifts and schedules</p>
        </div>
        <div className="flex gap-3">
          <Select value={viewMode} onValueChange={(v: 'day' | 'week') => setViewMode(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Staff</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input type="time" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input type="time" />
                  </div>
                </div>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Add Shift
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <span className="font-medium">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Staff List with Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Overview */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Staff on Duty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffUsers.map((user) => {
                const shift = getShiftForUser(user.id);
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`${getRoleColor(user.role)} text-white text-sm`}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <Badge variant="outline" className="capitalize text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    {shift ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No shift scheduled</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Mini Calendar */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600">On Duty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span className="text-gray-600">Off Duty</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shift Summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{todayShifts.length}</p>
              <p className="text-sm text-gray-600">Staff Scheduled</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {todayShifts.filter(s => {
                  const now = new Date();
                  const currentHour = now.getHours();
                  const startHour = parseInt(s.startTime.split(':')[0]);
                  const endHour = parseInt(s.endTime.split(':')[0]);
                  return currentHour >= startHour && currentHour < endHour;
                }).length}
              </p>
              <p className="text-sm text-gray-600">Currently Working</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">
                {todayShifts.reduce((sum, s) => {
                  const start = parseInt(s.startTime.split(':')[0]);
                  const end = parseInt(s.endTime.split(':')[0]);
                  return sum + (end - start);
                }, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Hours</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">
                {new Set(todayShifts.map(s => s.role)).size}
              </p>
              <p className="text-sm text-gray-600">Roles Covered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
