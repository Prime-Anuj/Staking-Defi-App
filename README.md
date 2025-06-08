# DeFi Token Staking DApp

A decentralized application (DApp) that allows users to stake ERC20 tokens and earn dynamic rewards. This project demonstrates modern DeFi principles with secure smart contract implementation and multi-network compatibility.

## 🚀 Features

- **Wallet Integration**: Seamless connection for users to stake their tokens
- **Multi-Network Support**: Compatible with multiple blockchain networks
- **Dynamic Reward System**: Reward calculation based on total staked amount (higher overall staked = lower individual rewards)
- **Secure Smart Contracts**: ERC20 token standards with reentrancy protection
- **Real-time Updates**: Live staking statistics and reward tracking
- **Responsive UI**: Modern, user-friendly interface built with React

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **Next.js** - React framework for production
- **Ethers.js** - Ethereum library for blockchain interaction
- **Moralis** - Web3 development platform

### Backend/Blockchain
- **Solidity** - Smart contract development
- **Hardhat** - Ethereum development environment
- **ERC20** - Token standard implementation
- **Reentrancy Guard** - Security mechanism

### Testing
- **Chai** - Assertion library
- **Mocha** - JavaScript testing framework

## 🌐 Supported Networks

- **Sepolia Testnet** - Ethereum test network
- **Amoy Testnet** - Polygon test network (recommended for lower gas fees)

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- MetaMask or compatible Web3 wallet
- Git

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd defi-staking-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Hardhat dependencies**
   ```bash
   npm install --save-dev hardhat
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your:
   - Private key for deployment
   - RPC URLs for Sepolia and Amoy networks
   - Moralis API keys

## 🔧 Configuration

### Hardhat Configuration

Update `hardhat.config.js` with network configurations:

```javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    amoy: {
      url: process.env.AMOY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

## 🚀 Usage

### Development

1. **Start the local blockchain**
   ```bash
   npx hardhat node
   ```

2. **Deploy smart contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Start the frontend**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Testnet Deployment

1. **Deploy to Sepolia**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. **Deploy to Amoy (Recommended - Lower Gas Fees)**
   ```bash
   npx hardhat run scripts/deploy.js --network amoy
   ```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npx hardhat test

# Run tests with coverage
npx hardhat coverage

# Run specific test file
npx hardhat test test/Staking.test.js
```

## 📊 Smart Contract Architecture

### Core Contracts

- **StakingContract.sol**: Main staking logic with dynamic rewards
- **RewardToken.sol**: ERC20 token for rewards
- **Security**: Implements OpenZeppelin's ReentrancyGuard

### Key Functions

- `stake(uint256 amount)`: Stake tokens
- `unstake(uint256 amount)`: Withdraw staked tokens
- `claimRewards()`: Claim earned rewards
- `getRewardRate()`: Get current dynamic reward rate

## 🔒 Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Control**: Role-based permissions
- **Input Validation**: Comprehensive parameter checking
- **Safe Math**: Overflow/underflow protection

## 📈 Performance Insights

### Network Comparison
- **Amoy Testnet (Polygon)**: Significantly lower transaction costs
- **Sepolia Testnet (Ethereum)**: Higher gas fees but familiar ecosystem

**Recommendation**: Use Amoy testnet for development and testing due to cost efficiency.




## 🙏 Acknowledgments

Special thanks to **Shaswat Nautiyal Sir** for the constant encouragement, motivation, and guidance throughout this project development journey.



## 🔗 Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Moralis Documentation](https://docs.moralis.io/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

---

**Built with ❤️ and lots of ☕**