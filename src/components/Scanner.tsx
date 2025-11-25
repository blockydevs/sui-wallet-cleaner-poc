import { useSuiClientQuery } from '@mysten/dapp-kit';
import { classifyObject } from '../utils/classification';
import { ObjectCard } from './ObjectCard';

interface ScannerProps {
  address: string;
}

export function Scanner({ address }: ScannerProps) {
  const { data, isPending, error } = useSuiClientQuery(
    'getOwnedObjects',
    { 
      owner: address,
      options: {
        showType: true,
        showContent: true,
        showDisplay: true,
      }
    },
    {
      enabled: !!address,
    }
  );

  if (isPending) return <div className="loading">Scanning wallet...</div>;
  if (error) return <div className="error">Error loading objects: {error.message}</div>;

  if (!data || data.data.length === 0) {
    return <div className="empty">No objects found in this wallet.</div>;
  }

  // Filter out SUI coins (simplistic check)
  const nonCoinObjects = data.data.filter(obj => {
    const type = obj.data?.type;
    // Filter out any Coin<T>
    return type && !type.startsWith('0x2::coin::Coin');
  });

  const classifiedObjects = nonCoinObjects.map(obj => ({
    ...obj,
    classification: classifyObject(obj)
  }));

  return (
    <div className="scanner">
      <h2>Wallet Contents ({classifiedObjects.length})</h2>
      <div className="object-grid">
        {classifiedObjects.map(obj => (
          <ObjectCard key={obj.data?.objectId} object={obj} />
        ))}
      </div>
    </div>
  );
}

