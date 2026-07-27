# Stellar Live Poll DApp

This project is a decentralized application (DApp) built on the Stellar network using Soroban (Rust) for the Rise In Level 2 certification project. It allows users to participate in a live poll by voting for different options, ensuring transparency and immutability through the blockchain.

## Features
- **Smart Contract (Soroban/Rust)**: Implements polling logic, tracks votes, and ensures users can only vote once.
- **Frontend (React + Vite)**: A responsive UI to connect a Stellar wallet (Freighter) and cast votes.
- **Multi-wallet Support**: Interacts seamlessly with the Freighter wallet.
- **Real-time Status**: Shows transaction loading/success/error statuses dynamically.

## Smart Contract Details

### Error Types
The contract implements three distinct error types to handle invalid operations:
1. `AlreadyInitialized (1)`: Thrown if someone attempts to initialize an already initialized poll.
2. `AlreadyVoted (2)`: Thrown if a user (address) attempts to vote more than once.
3. `InvalidOption (3)`: Thrown if a user attempts to vote for an option index that does not exist.

### Build and Deploy

#### Prerequisites
- Rust and Cargo
- Soroban CLI (`cargo install --locked soroban-cli`)
- A funded Stellar testnet account

#### 1. Build the Contract
Navigate to the `contracts/live_poll` directory and build the contract:
```bash
cd contracts/live_poll
soroban contract build
```

#### 2. Deploy to Testnet
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/live_poll.wasm \
  --source <YOUR_IDENTITY> \
  --network testnet
```
*Take note of the output **Contract ID**.*

#### 3. Initialize the Poll
```bash
soroban contract invoke \
  --id <YOUR_CONTRACT_ID> \
  --source <YOUR_IDENTITY> \
  --network testnet \
  -- \
  init \
  --question "What is your favorite programming language?" \
  --options '["Rust", "TypeScript", "Python"]'
```

## Frontend Setup

#### 1. Update Contract ID
Open `frontend/src/App.tsx` and replace `YOUR_CONTRACT_ID_HERE` with the actual Contract ID you received during deployment.

#### 2. Install Dependencies
Navigate to the `frontend` directory and install the required packages:
```bash
cd frontend
npm install
```

#### 3. Run the Development Server
```bash
npm run dev
```
Open your browser to the local URL provided (usually `http://localhost:5173`) to view and interact with the DApp.

## Live Demonstration
*(Include a link or a GIF/video of the live demonstration here once deployed to a hosting service like Vercel or Netlify)*

## Contract Verification Details
- **Network**: Stellar Testnet
- **Contract ID**: `[INSERT_YOUR_CONTRACT_ID_HERE]`
- **Source Account**: `[INSERT_YOUR_PUBLIC_KEY_HERE]`
