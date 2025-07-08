import { Card } from '@/components/ui/card';
import FilterContent from './FilterContent'; // Import the new FilterContent

export default function FilterSidebar() {
  return (
    <Card className="hidden lg:block h-fit sticky top-[4.5rem] bg-white/95 backdrop-blur-lg shadow-xl border-gray-300">
      <FilterContent />
    </Card>
  );
}
