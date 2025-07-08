import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Separator from '@/components/ui/separator';

// This component contains only the filter UI, without any wrapping Card or visibility/positioning classes.
export default function FilterContent() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Filters</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Accordion type="multiple" defaultValue={['network', 'settle-time', 'collateral']}>
          <AccordionItem value="network">
            <AccordionTrigger className="text-base font-semibold">Network</AccordionTrigger>
            <AccordionContent className="grid gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Checkbox id="network-eth" />
                <Label htmlFor="network-eth">Ethereum</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="network-bsc" />
                <Label htmlFor="network-bsc">BNB Smart Chain</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="network-poly" />
                <Label htmlFor="network-poly">Polygon</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="network-sol" />
                <Label htmlFor="network-sol">Solana</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="settle-time">
            <AccordionTrigger className="text-base font-semibold">
              Settle After TGE
            </AccordionTrigger>
            <AccordionContent className="grid gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Checkbox id="settle-1h" />
                <Label htmlFor="settle-1h">1 Hour</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="settle-2h" />
                <Label htmlFor="settle-2h">2 Hours</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="settle-4h" />
                <Label htmlFor="settle-4h">4 Hours</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="settle-custom" />
                <Label htmlFor="settle-custom">Custom</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="collateral">
            <AccordionTrigger className="text-base font-semibold">
              Percent Collateral
            </AccordionTrigger>
            <AccordionContent className="grid gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Checkbox id="collateral-0" />
                <Label htmlFor="collateral-0">0%</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="collateral-10" />
                <Label htmlFor="collateral-10">10%</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="collateral-25" />
                <Label htmlFor="collateral-25">25%</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="collateral-50" />
                <Label htmlFor="collateral-50">50%</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Separator className="bg-gray-200" />
        <Button variant="outline">Apply Filters</Button>
        <Button variant="ghost">Clear Filters</Button>
      </CardContent>
    </>
  );
}
