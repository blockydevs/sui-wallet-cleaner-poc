import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';
import type { Classification } from '../utils/classification';
import { Send, EyeOff } from 'lucide-react';

interface ObjectCardProps {
  object: any;
}

export function ObjectCard({ object }: ObjectCardProps) {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [isHidden, setIsHidden] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [recipient, setRecipient] = useState('');

  const classification: Classification = object.classification;
  const display = object.data?.display?.data;
  const name = display?.name || 'Unknown Object';
  const description = display?.description || 'No description';
  const imageUrl = display?.image_url || display?.link || '';
  const objectId = object.data?.objectId;

  if (isHidden) return null;

  const handleHide = () => {
    setIsHidden(true);
  };

  const handleTransfer = () => {
    if (!recipient) return;
    
    const txb = new Transaction();
    txb.transferObjects([txb.object(objectId)], txb.pure.address(recipient));

    signAndExecuteTransaction(
      { transaction: txb },
      {
        onSuccess: (result) => {
          console.log('Transfer success:', result);
          setIsHidden(true); // Remove from view after transfer
        },
        onError: (err) => {
          console.error('Transfer failed:', err);
          alert('Transfer failed. See console for details.');
        }
      }
    );
  };


  return (
    <div className={`object-card ${classification.toLowerCase()}`}>
      <div className="card-header">
        <span className={`badge ${classification.toLowerCase()}`}>{classification}</span>
        {imageUrl && <img src={imageUrl} alt={name} className="object-image" />}
      </div>
      <div className="card-body">
        <h3>{name}</h3>
        <p className="object-id" title={objectId}>{objectId.slice(0, 6)}...{objectId.slice(-4)}</p>
        <p className="description">{description.slice(0, 100)}{description.length > 100 ? '...' : ''}</p>
        
        <div className="actions">
          <button onClick={() => setShowTransfer(!showTransfer)} className="action-btn" title="Transfer">
            <Send size={16} /> Transfer
          </button>
          <button onClick={handleHide} className="action-btn" title="Hide">
            <EyeOff size={16} /> Hide
          </button>
          {/* <button onClick={handleBurn} className="action-btn danger" title="Burn">
            <Trash2 size={16} /> Burn
          </button> */}
        </div>

        {showTransfer && (
          <div className="transfer-form">
            <input 
              type="text" 
              placeholder="Recipient Address" 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <button onClick={handleTransfer} disabled={!recipient}>Confirm</button>
          </div>
        )}
      </div>
    </div>
  );
}

