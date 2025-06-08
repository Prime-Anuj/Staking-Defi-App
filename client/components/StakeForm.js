import React from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';
import { Form } from 'web3uikit';
import { ethers } from 'ethers';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

function StakeForm({ onTransactionSuccess }) {
  const { account, provider } = useMoralis();
  const stakingAddress = "0x6E056Cb44317Cadcf4AD3DF626614169Ae591134";
  const rewardTokenAddress = "0xa5611388d46D4F37f9f309F14c3f4CE17cF3269A";

  const { runContractFunction } = useWeb3Contract();

  // Validate network and contracts before transactions
  const validateNetwork = async () => {
    if (!provider) {
      throw new Error('No provider found');
    }

    try {
      const web3Provider = new ethers.providers.Web3Provider(provider);
      
      // Check if contracts exist
      const stakingCode = await web3Provider.getCode(stakingAddress);
      const tokenCode = await web3Provider.getCode(rewardTokenAddress);
      
      if (stakingCode === '0x' || tokenCode === '0x') {
        throw new Error('Contracts not found on this network. Please ensure you are connected to the correct network.');
      }
      
      const network = await web3Provider.getNetwork();
      console.log('Validated network:', network);
      
      return true;
    } catch (error) {
      console.error('Network validation failed:', error);
      throw error;
    }
  };

  async function handleStakeSubmit(data) {
    try {
      // Validate network first
      await validateNetwork();
      
      const amountToStake = data.data[0].inputResult;
      
      if (!amountToStake || amountToStake <= 0) {
        alert('Please enter a valid amount to stake');
        return;
      }

      const parsedAmount = ethers.utils.parseEther(amountToStake.toString());

      console.log('Starting stake process for amount:', amountToStake);

      const approveOptions = {
        abi: TokenAbi.abi,
        contractAddress: rewardTokenAddress,
        functionName: 'approve',
        params: {
          spender: stakingAddress,
          amount: parsedAmount
        }
      };

      console.log('Submitting approve transaction...');

      await runContractFunction({
        params: approveOptions,
        onError: (error) => {
          console.error('Approve error:', error);
          alert('Approve transaction failed: ' + error.message);
        },
        onSuccess: async (tx) => {
          console.log('Approve transaction submitted:', tx);
          
          if (tx && tx.wait) {
            console.log('Waiting for approve confirmation...');
            await tx.wait(1);
            console.log('Approve transaction confirmed');
            await handleApproveSuccess(parsedAmount);
          } else {
            console.log('No transaction object returned from approve');
            // For some providers, we might not get a tx object back
            // Try to proceed anyway after a short delay
            setTimeout(() => handleApproveSuccess(parsedAmount), 2000);
          }
        }
      });
    } catch (error) {
      console.error('Error in handleStakeSubmit:', error);
      alert('Transaction failed: ' + error.message);
    }
  }

  async function handleApproveSuccess(amountToStakeFormatted) {
    try {
      const stakeOptions = {
        abi: StakingAbi.abi,
        contractAddress: stakingAddress,
        functionName: 'stake',
        params: {
          amount: amountToStakeFormatted
        }
      };

      console.log('Submitting stake transaction...');

      await runContractFunction({
        params: stakeOptions,
        onError: (error) => {
          console.error('Stake error:', error);
          alert('Stake transaction failed: ' + error.message);
        },
        onSuccess: async (tx) => {
          console.log('Stake transaction submitted:', tx);
          
          if (tx && tx.wait) {
            console.log('Waiting for stake confirmation...');
            await tx.wait(1);
            console.log('Stake transaction confirmed');
            
            // Trigger UI refresh
            if (onTransactionSuccess) {
              onTransactionSuccess();
            }
            
            alert('Stake successful!');
          } else {
            console.log('No transaction object returned from stake');
            // Trigger UI refresh anyway
            if (onTransactionSuccess) {
              onTransactionSuccess();
            }
            alert('Stake transaction submitted. Please check your wallet for confirmation.');
          }
        }
      });
    } catch (error) {
      console.error('Error in handleApproveSuccess:', error);
      alert('Stake transaction failed: ' + error.message);
    }
  }

  if (!account) {
    return (
      <div className='p-3'>
        <div className='text-red-500'>Please connect your wallet to stake</div>
      </div>
    );
  }

  return (
  <div className="space-y-6">
    <Form
      onSubmit={handleStakeSubmit}
      data={[{
        inputWidth: '100%',
        name: 'Amount to stake',
        type: 'number',
        step: '0.0001',
        value: '',
        key: 'amountToStake',
        inputClassName: 'border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-purple-500',
        labelClassName: 'text-gray-700 font-medium'
      }]}
      title={
        <div className="flex items-center gap-2">
          <ArrowPathIcon className="w-6 h-6 text-purple-600" />
          <span className="text-xl">Stake Tokens</span>
        </div>
      }
      buttonConfig={{
        text: 'Stake Now',
        theme: 'primary',
        className: 'w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl'
      }}
    />
    
    <div className="mt-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Network:</span> Local Hardhat
        </div>
        <div className="truncate">
          <span className="font-medium">Staking Contract:</span> {stakingAddress}
        </div>
        <div className="truncate">
          <span className="font-medium">Token Contract:</span> {rewardTokenAddress}
        </div>
      </div>
    </div>
  </div>
);
  
}

export default StakeForm;
