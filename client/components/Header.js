import React from 'react';
import { ConnectButton } from 'web3uikit';

function Header() {
  return (
    <nav className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-900 shadow-xl position-fixed t-0 rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
            🪙 Crypto Staking
          </h1>
          <div className="">
            <ConnectButton moralisAuth={false} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
