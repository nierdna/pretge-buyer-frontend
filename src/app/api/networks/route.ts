import { NetworkService } from '@/server/service/network.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chainType = searchParams.get('chainType') as 'evm' | 'sol' | 'sui' | undefined;

    if (chainType) {
      const result = await NetworkService.getNetworksByChainType(chainType);
      return NextResponse.json(result);
    }

    const result = await NetworkService.getNetworks();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching networks:', error);
    return NextResponse.json({ error: 'Failed to fetch networks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.chainType || !body.rpcUrl) {
      return NextResponse.json(
        { error: 'Name, chainType, and rpcUrl are required' },
        { status: 400 }
      );
    }

    const networkData = {
      name: body.name,
      chainType: body.chainType,
      rpcUrl: body.rpcUrl,
      explorerUrl: body.explorerUrl || '',
    };

    const network = await NetworkService.createNetwork(networkData);
    return NextResponse.json(network, { status: 201 });
  } catch (error) {
    console.error('Error creating network:', error);
    return NextResponse.json({ error: 'Failed to create network' }, { status: 500 });
  }
}
