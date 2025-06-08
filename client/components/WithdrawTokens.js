import React from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';
import { Form } from 'web3uikit';
import { ethers } from 'ethers';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

function WithdrawTokens() {
    const { account, provider } = useMoralis();
    const stakingAddress = "0x3E004927B1504B65c7D0101e7b9865A034a76B4f";
    const rewardTokenAddress = "0x3DA372c085dFAC22c90f57fc3A524dfB765Da32f";

    const { runContractFunction } = useWeb3Contract();

    const validateNetwork = async () => {
        if (!provider) {
            throw new Error("No provider found");
        }
        try {
            const web3Provider = new ethers.providers.Web3Provider(provider);

            const stakingCode = await web3Provider.getCode(stakingAddress);
            const tokenCode = await web3Provider.getCode(rewardTokenAddress);

            if (stakingCode === '0x' || tokenCode === '0x') {
                throw new Error('Contracts not found on this network. Please ensure you are connected to the correct network.');
            }

            const network = await web3Provider.getNetwork();
            console.log("Validated network", network);
            return true;
        }
        catch (error) {
            console.error("Network validation failed: ", error);
            throw error;
        }
    }

    async function handleWithdrawSubmit(data) {
    try {
        await validateNetwork();
        const amountToWithdraw = data.data[0].inputResult;

        if (!amountToWithdraw) {
            alert("Please enter an amount to withdraw");
            return;
        }

        // Validate input format using regular expression
        if (!/^\d+(\.\d+)?$/.test(amountToWithdraw)) {
            alert("Invalid amount format. Use numbers only (e.g. 100 or 0.5)");
            return;
        }

        // Convert to Wei with proper error handling
        let amountInWei;
        try {
            amountInWei = ethers.utils.parseEther(amountToWithdraw);
        } catch (error) {
            alert("Invalid amount value. Please enter a valid number.");
            return;
        }

        if (amountInWei.isZero()) {
            alert("Amount must be greater than zero");
            return;
        }

        const withdrawOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'withdraw',
    params: [amountInWei],
    onSuccess: (tx) => {
        console.log("Withdrawal successful:", tx);
        alert(`Successfully withdrew ${amountToWithdraw} tokens!`);
    },
    onError: (error) => {
        let simplifiedError = "Insufficient balance or contract error";
        if (error && error.message && typeof error.message === "string") {
            simplifiedError = error.message.replace("execution reverted: ", "").split(", ")[0];
        } else if (error && error.reason && typeof error.reason === "string") {
            simplifiedError = error.reason;
        }
        alert(`Withdrawal failed: ${simplifiedError}`);
    }
};


        await runContractFunction(withdrawOptions);

    } catch (error) {
        console.error("Withdrawal error:", error);
        alert(`Transaction failed: ${error.reason || error.message || "Unknown error"}`);
    }
}


    return (
        <div className="space-y-6">
            <Form
                onSubmit={handleWithdrawSubmit}
                data={[{
                    inputWidth: '100%',
                    name: 'Amount to withdraw',
                    type: 'number',
                    step: '0.0001',
                    value: '',
                    key: 'amountToWithdraw',
                    inputClassName: 'border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-purple-500',
                    labelClassName: 'text-gray-700 font-medium'
                }]}
                title={
                    <div className="flex items-center gap-2">
                        <ArrowPathIcon className="w-6 h-6 text-purple-600" />
                        <span className="text-xl">Withdraw Tokens</span>
                    </div>
                }
                buttonConfig={{
                    text: 'Withdraw Now',
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

export default WithdrawTokens;
