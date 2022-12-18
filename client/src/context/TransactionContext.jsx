import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEhtereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [currentAccount, setCurrentAccount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const getAllTransactions = async () => {
        try{
            if(!ethereum) return alert("Please install metamask");
            const transactionsContract = getEhtereumContract();
            const availableTransactions = await transactionsContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
              }));

            setTransactions(structuredTransactions);
            
            console.log(structuredTransactions)

        }catch (error) {
          console.log(error);
        }
      };
    

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install the metamask")

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error)

            throw new Error("No Ethereum Object.")
        }
    }

    const checkIfTransactionsExist = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEhtereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
    
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install the metamask")

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0])
            window.location.reload();
        } catch (error) {
            console.log(error)

            throw new Error("No Ethereum Object.")
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("Please install the metamask")

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEhtereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                  from: currentAccount,
                  to: addressTo,
                  gas: "0x5208", //21000 GWEI
                  value: parsedAmount._hex,
                }],
              });

              const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

              setIsLoading(true);
              console.log(`Loading - ${transactionHash.hash}`);
              await transactionHash.wait();
              setIsLoading(false);
              console.log(`Success - ${transactionHash.hash}`);

              const transactionCount = await transactionContract.getTransactionCount();

              setTransactionCount(transactionCount.toNumber());
              window.location.reload();
        } catch (error) {
            console.log(error)

            throw new Error("No Ethereum Object.")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setformData, handleChange, sendTransaction,transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    );
}



