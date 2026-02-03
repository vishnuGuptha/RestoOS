import type { Table } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onClick?: () => void;
  selected?: boolean;
}

export function TableCard({ table, onClick, selected = false }: TableCardProps) {
  const statusConfig = {
    available: { label: 'Available', color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    occupied: { label: 'Occupied', color: 'bg-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    reserved: { label: 'Reserved', color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    cleaning: { label: 'Cleaning', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  };

  const config = statusConfig[table.status];

  return (
    <Card 
      onClick={onClick}
      className={`border-2 cursor-pointer transition-all hover:shadow-md ${
        selected 
          ? 'border-orange-500 shadow-md' 
          : `border-transparent hover:border-gray-200`
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-gray-900">Table {table.number}</h4>
              <div className={`w-2 h-2 rounded-full ${config.color}`} />
            </div>
            <p className="text-xs text-gray-500 mt-1">{table.location}</p>
          </div>
          <Badge variant="outline" className={`${config.bgColor} ${config.borderColor} text-gray-700`}>
            <Users className="w-3 h-3 mr-1" />
            {table.capacity}
          </Badge>
        </div>
        
        <div className="mt-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} text-gray-700`}>
            {config.label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
