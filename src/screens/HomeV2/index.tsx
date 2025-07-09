import FilterSheet from './components/FilterSheet';
import FilterSidebar from './components/FilterSidebar';
import FlashSale from './components/FlashSale';
import OfferList from './components/OfferList';

export default function HomePage() {
  return (
    // <div className="min-h-screen text-gray-900">
    //   <Header />
    <div className="flex-1">
      {' '}
      {/* Applied the main page background gradient here */}
      <FlashSale />
      <section className="py-4 md:py-8">
        <FilterSheet /> {/* Mobile filter button */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <FilterSidebar /> {/* Desktop filter sidebar */}
          <OfferList />
        </div>
      </section>
    </div>
    // </div>
  );
}
