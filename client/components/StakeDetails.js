import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';
import { ethers } from 'ethers';

function StakeDetails({ refreshTrigger }) {
  const { account, isWeb3Enabled, provider } = useMoralis();
  const [rtBalance, setRtBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [earnedBalance, setEarnedBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contractsValidated, setContractsValidated] = useState(false);

  const stakingAddress = "0x3E004927B1504B65c7D0101e7b9865A034a76B4f";
  const rewardTokenAddress = "0x3DA372c085dFAC22c90f57fc3A524dfB765Da32f";

  // Use refs to track the latest values for the interval
  const accountRef = useRef(account);
  const isWeb3EnabledRef = useRef(isWeb3Enabled);
  const contractsValidatedRef = useRef(contractsValidated);

  // Update refs whenever values change
  useEffect(() => {
    accountRef.current = account; //connected account
  }, [account]);

  useEffect(() => {
    isWeb3EnabledRef.current = isWeb3Enabled;
  }, [isWeb3Enabled]);

  useEffect(() => {
    contractsValidatedRef.current = contractsValidated;
  }, [contractsValidated]);



  //smart contract function integration 


  const { runContractFunction: getRTBalance } = useWeb3Contract({
    abi: TokenAbi.abi,
    contractAddress: rewardTokenAddress,
    functionName: 'balanceOf',
    params: { account }
  });

  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'getStaked',
    params: { account }
  });

  const { runContractFunction: getEarnedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'earned',
    params: { account }
  });

  const formatBalance = (balance) => {
    if (!balance) return '0';
    
    try {
      const formatted = ethers.utils.formatEther(balance.toString());
      return parseFloat(formatted).toFixed(2);
    } catch (error) {
      console.error('Error formatting balance:', error);
      return '0';
    }
  };

  // Validate contracts exist on the network
  const validateContracts = useCallback(async () => {
    if (!provider || !isWeb3Enabled) return false;
    
    try {
      const web3Provider = new ethers.providers.Web3Provider(provider);
      
      // Check if contracts exist on the network
      const stakingCode = await web3Provider.getCode(stakingAddress);
      const tokenCode = await web3Provider.getCode(rewardTokenAddress);
      
      if (stakingCode === '0x' || tokenCode === '0x') {
        setError('Contracts not found on this network. Please ensure you are connected to the correct network and contracts are deployed.');
        return false;
      }
      
      // Check network
      // checks is connected network matching with wallet account network or not
      const network = await web3Provider.getNetwork();
      console.log('Connected to network:', network);
      
      setError('');
      return true;
    } catch (error) {
      console.error('Error validating contracts:', error);
      setError('Error validating contracts: ' + error.message);
      return false;
    }
  }, [provider, isWeb3Enabled, stakingAddress, rewardTokenAddress]);

  // Main function to update UI values with error handling
  const updateUiValues = useCallback(async () => {
    // Use refs to get the latest values
    if (!accountRef.current || !isWeb3EnabledRef.current || !contractsValidatedRef.current) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Get RT Balance with error handling
      try {
        const rtBalanceResult = await getRTBalance({
          onError: (error) => console.log('RT Balance error:', error)
        });
        if (rtBalanceResult) {
          setRtBalance(formatBalance(rtBalanceResult));
        }
      } catch (error) {
        console.error('Failed to get RT balance:', error);
        setRtBalance('Error');
      }

      // Get Staked Balance with error handling
      try {
        const stakedBalanceResult = await getStakedBalance({
          onError: (error) => console.log('Staked Balance error:', error)
        });
        if (stakedBalanceResult) {
          setStakedBalance(formatBalance(stakedBalanceResult));
        }
      } catch (error) {
        console.error('Failed to get staked balance:', error);
        setStakedBalance('Error');
      }

      // Get Earned Balance with error handling
      try {
        const earnedBalanceResult = await getEarnedBalance({
          onError: (error) => console.log('Earned Balance error:', error)
        });
        if (earnedBalanceResult) {
          setEarnedBalance(formatBalance(earnedBalanceResult));
        }
      } catch (error) {
        console.error('Failed to get earned balance:', error);
        setEarnedBalance('Error');
      }
    } catch (error) {
      console.error('Error updating UI values:', error);
      setError('Error loading balances: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [getRTBalance, getStakedBalance, getEarnedBalance]);

  // Effect to validate contracts when wallet connects
  useEffect(() => {
    const checkContracts = async () => {
      if (account && isWeb3Enabled) {
        const isValid = await validateContracts();
        setContractsValidated(isValid);
      } else {
        setContractsValidated(false);
      }
    };
    
    checkContracts();
  }, [account, isWeb3Enabled, validateContracts]);

  // Effect to update UI values initially and when refresh is triggered
  useEffect(() => {
    if (contractsValidated) {
      updateUiValues();
    }
  }, [contractsValidated, refreshTrigger, updateUiValues]);

  // Effect for 5-second auto-refresh
  useEffect(() => {
    if (!contractsValidated) return;

    const interval = setInterval(() => {
      // Check if we still have all required conditions using refs
      if (accountRef.current && isWeb3EnabledRef.current && contractsValidatedRef.current) {
        updateUiValues();
      }
    }, 10000); // 5 seconds

    // Cleanup function to clear interval
    return () => {
      clearInterval(interval);
    };
  }, [contractsValidated, updateUiValues]);

  if (!isWeb3Enabled) {
    return (
      <div className='p-3'>
        <div className='text-red-500 mb-2'>Please connect your wallet</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-3'>
        <div className='text-red-500 mb-2'>Error: {error}</div>
        <button 
          onClick={() => validateContracts().then(setContractsValidated)}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!contractsValidated) {
    return (
      <div className='p-3'>
        <div className='text-yellow-500 mb-2'>Validating contracts...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='p-3 flex justify-center items-center'>
        <div className='text-black mb-2 h-[20vh] w-[20vh] bg-cyay-700 rounded-xl'>Loading balances...</div>
      </div>
    );
  }

  
return (
  <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-pink-100 to-blue-100 p-6 rounded-xl overflow-auto">
        <div className="text-sm text-gray-600 mb-2">Total Supply [RT]</div>
        <div className="text-3xl font-bold text-pink-600">{rtBalance}</div>
      </div>
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-xl">
        <div className="text-sm text-gray-600 mb-2">Earned Balance</div>
        <div className="text-3xl font-bold text-blue-600">{earnedBalance}</div>
      </div>
      <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl">
        <div className="text-sm text-gray-600 mb-2">Staked Balance</div>
        <div className="text-3xl font-bold text-purple-600">{stakedBalance}</div>
      </div>
    </div>
    
    <div className="mt-6 text-xs text-gray-500 text-center">
      <span className="animate-pulse">↻ Auto-refreshing every 10 seconds</span>
      <div className="mt-2">
        Connected to: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
      </div>
    </div>
  </div>
);

}

export default StakeDetails;
