# Chapter 1 - What is Ethereum?

## 1. What is Ethereum?

1. From a computational perspective, Ethereum is a deterministic but practically unbounded state machine, made up of a globally accessible shared state and a virtual machine that applies changes to that state.
2. From a practical perspective, Ethereum is an open-source decentralized infrastructure that allows programs called *smart contracts* to run. It uses a blockchain to synchronize and store changes to the system state. It uses the Ether cryptocurrency to measure and limit the cost of execution resources.

## 2. Ethereum vs Bitcoin

- Bitcoin was created with the goal of being decentralized money, presented as *electronic cash*. Ethereum, by contrast, was created as a global platform for decentralized computation.
- Bitcoin has a programming language limited to true-or-false statements. Ethereum is Turing-complete, which means any general computer program can be developed on top of it. Ethereum is conceived as a computer.
- In 2022, the *The Merge* upgrade introduced another major difference from Bitcoin: the move from proof of work to proof of stake.

## 3. Components of a blockchain and Ethereum clients

- A P2P network that connects all participants and propagates transactions and new blocks.
- Messages in the form of transactions that represent a change in state.
- A set of rules that defines what a transaction is and how a state transition takes place.
- A state machine that processes transactions according to those rules.
- A consensus algorithm that decentralizes control of the blockchain by forcing participants to cooperate.
- A sound incentive system that economically secures the network state in an open environment.
- One or more open-source implementations of each component (clients).

## 4. Permissioned and permissionless, public and private

The chapter categorizes blockchains according to participation requirements and public access.

## 5. Birth of Ethereum

- Ethereum emerged as a response to Bitcoin’s limitations when trying to support more complex applications directly on-chain. Building on Bitcoin meant accepting strong restrictions; creating a new blockchain meant rebuilding the entire infrastructure.
- In late 2013, Vitalik Buterin proposed a general-purpose, Turing-complete blockchain. Gavin Wood joined the project early and helped turn the idea into a protocol and implementation.
- The key conceptual shift was moving from a blockchain focused only on programmable money to a general platform for decentralized computation, capable of becoming the foundation for use cases such as DeFi, NFTs, and DAOs.
- Ethereum’s genesis block was mined on July 30, 2015.

## 6. Stages of Development

- Ethereum’s development was organized into four major stages, each introducing hard forks and non-backward-compatible changes.
  1. Frontier: the initial 2015 release, aimed at miners and developers. It allowed the network and the first dApps to be tested and also introduced the *difficulty bomb* to encourage a future transition away from proof of work.
  2. Homestead: improved protocol security and stability through upgrades that made Ethereum safer and more developer-friendly, while still in beta.
  3. Metropolis: expanded network functionality and made building dApps easier. It included forks such as Byzantium, Constantinople, and Istanbul, with improvements to security, gas costs, and scalability.
  4. Serenity: the stage associated with Ethereum 2.0 and the move from proof of work to proof of stake. It aims for better sustainability, efficiency, and scalability.
- Serenity is also divided into several sub-stages: *The Merge*, *The Surge*, *The Scourge*, *The Verge*, *The Purge*, and *The Splurge*.

## 7. A general-purpose blockchain

- Bitcoin can be understood as a distributed state machine that tracks ownership of its currency. Ethereum is also a distributed state machine, but instead of being limited to balances, it maintains a general-purpose key-value data store.
- Ethereum can store code and data in its state and execute that code on the EVM. The blockchain records how that global “memory” changes over time.
- The core idea is that Ethereum answers the question: what happens if we can program any arbitrary state transition in a world computer governed by consensus?

## 8. Ethereum components

- P2P network: Ethereum operates on mainnet using the ÐΞVp2p protocol and TCP port 30303.
- Consensus rules: originally Ethash (proof of work); since *The Merge*, proof of stake.
- Transactions: network messages that include sender, recipient, value, and a data field.
- State machine: the Ethereum Virtual Machine (EVM), a stack-based virtual machine that executes bytecode. *Smart contracts* are written in high-level languages such as Solidity and then compiled.
- Data structures: each node stores state and transactions in a local database, usually LevelDB, organized with hash-based structures such as the Merkle-Patricia trie.
- Economic security and consensus: in proof of stake, validators lock capital to participate in validation and secure the network.
- Clients: Ethereum uses interoperable execution and consensus clients, such as Geth or Nethermind for execution and Prysm or Lighthouse for consensus.

## 9. Turing completeness

- A Turing-complete system can simulate any Turing machine; in other words, it can execute any computable algorithm, given enough time and finite memory.
- Ethereum is Turing-complete because the EVM can execute stored programs, read and write memory, and produce arbitrary state transitions.
- This flexibility introduces a problem: it is impossible to know in advance whether a program will halt or how many resources it will consume. This is the *halting problem*.
- To limit that risk, Ethereum uses *gas*: each instruction has a cost, and every transaction sets a maximum gas limit. If gas runs out, execution stops. This makes general computation possible without allowing infinite resource consumption.

## 10. dApps

- Ethereum quickly evolved from being a programmable blockchain into a platform for building decentralized applications, or dApps.
- A dApp includes at least one *smart contract* deployed on-chain and a web interface for the user.
- In a fuller vision, it can also integrate P2P storage and decentralized messaging, although in practice many current dApps combine smart contracts with more traditional web frontends.

## 11. Web3

- Web3 represents the “third age” of the internet: a shift from centralized web applications toward applications built on decentralized protocols.
- The concept was pushed by Gavin Wood and proposes that application logic, data, and coordination rely less on central intermediaries and more on open P2P networks.
- In that context, Ethereum is presented as a foundational layer for web applications with ownership, execution, and shared rules enforced at the protocol level.

## 12. Development culture

- Bitcoin development culture is conservative: it prioritizes stability, backward compatibility, and slow change. Ethereum, by contrast, prioritizes rapid evolution and innovation, even when that breaks compatibility.
- In Ethereum, changes are coordinated publicly, and developers have to assume that the platform will continue evolving. That forces builders to stay flexible and be ready to migrate contracts, users, and funds.
- There is an important tension between deploying software on supposedly “immutable” infrastructure and, at the same time, building on top of a platform that is still actively changing.
- The advantage of this culture is faster innovation; the downside is that it demands more adaptation from anyone building on Ethereum.

## Session resources

- Slides: https://drive.google.com/file/d/1kZLWj9N8C96wh-Ow2iV1D-Q9G_IU_4CU/view?usp=drive_link
- Replay playlist: https://www.youtube.com/playlist?list=PLvTXryB-aecnlPmF9cyA8svSmezw7bTX_
