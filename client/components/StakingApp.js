import React, { useState } from 'react';
import StakeForm from './StakeForm';
import StakeDetails from './StakeDetails';

function StakingApp() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-pink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12 animate-fade-in">
          🚀 Staking DApp
        </h1>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Stake Form Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl transform transition-all hover:scale-[1.01]">
            <div className="p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
                Stake Tokens
              </h2>
              <StakeForm onTransactionSuccess={handleTransactionSuccess} />
            </div>
          </div>
          
          {/* Stake Details Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl transform transition-all hover:scale-[1.01]">
            <div className="p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Your Balances
              </h2>
              <StakeDetails refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
        
        {/* Troubleshooting Card */}
        <div className="mt-12 max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            Troubleshooting Tips
          </h3>
          <ul className="text-gray-700 space-y-2 pl-6 list-disc">
            <li>Connect to Hardhat network (localhost:8545)</li>
            <li>Ensure contracts are deployed to shown addresses</li>
            <li>Check test token balance in your wallet</li>
            <li>Reset MetaMask connection if seeing errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StakingApp;
