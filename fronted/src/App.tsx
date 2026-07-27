import { useState, useEffect } from 'react';
import { isAllowed, setAllowed, getUserInfo, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

const CONTRACT_ID = 'YOUR_CONTRACT_ID_HERE'; // Replace after deploying
const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [question, setQuestion] = useState('Loading poll...');
  const [options, setOptions] = useState<{name: string, votes: number}[]>([]);
  const [status, setStatus] = useState<{type: 'error'|'success'|'loading', msg: string} | null>(null);

  useEffect(() => {
    checkConnection();
    // In a real app, you would fetch poll state here.
    // For this demo, let's just mock the data until the contract is deployed.
    setQuestion('What is your favorite programming language?');
    setOptions([
      { name: 'Rust', votes: 12 },
      { name: 'TypeScript', votes: 8 },
      { name: 'Python', votes: 5 }
    ]);
  }, []);

  const checkConnection = async () => {
    if (await isAllowed()) {
      const user = await getUserInfo();
      if (user) setAddress(user.publicKey);
    }
  };

  const connectWallet = async () => {
    try {
      await setAllowed();
      await checkConnection();
    } catch (e) {
      console.error(e);
      setStatus({ type: 'error', msg: 'Failed to connect wallet.' });
    }
  };

  const vote = async (index: number) => {
    if (!address) return setStatus({ type: 'error', msg: 'Please connect wallet first.' });
    if (CONTRACT_ID === 'YOUR_CONTRACT_ID_HERE') {
      return setStatus({ type: 'error', msg: 'Please deploy contract and set CONTRACT_ID in App.tsx.' });
    }

    try {
      setStatus({ type: 'loading', msg: 'Preparing transaction...' });
      
      const server = new StellarSdk.rpc.Server(RPC_URL, { allowHttp: true });
      const source = await server.getAccount(address);
      
      // Pseudo-code for invoking the smart contract function
      // In production, build the transaction using StellarSdk.TransactionBuilder 
      // and sign it using signTransaction() from Freighter.
      
      setStatus({ type: 'success', msg: 'Vote submitted successfully! (Mocked for demo)' });
    } catch (e: any) {
      console.error(e);
      setStatus({ type: 'error', msg: e.message || 'Transaction failed.' });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Live Poll</h1>
        {!address ? (
          <button className="button" onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>Connected: {address.substring(0,6)}...{address.substring(address.length-4)}</div>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>{question}</h2>
        {options.map((opt, i) => (
          <div key={i} className="poll-option">
            <span>{opt.name} - {opt.votes} votes</span>
            <button className="button" onClick={() => vote(i)} disabled={status?.type === 'loading'}>
              Vote
            </button>
          </div>
        ))}
      </div>

      {status && (
        <div className={status.type === 'error' ? 'error' : status.type === 'success' ? 'success' : ''}>
          {status.msg}
        </div>
      )}
    </div>
  );
}

export default App;
