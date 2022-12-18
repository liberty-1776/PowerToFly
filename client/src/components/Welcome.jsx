import React  from 'react';
import { TransactionContext } from "../context/TransactionContext";
import { Loader } from ".";
import { useContext } from 'react';



const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
      placeholder={placeholder}
      type={type}
      step="0.0001"
      value={value}
      onChange={(e) => handleChange(e, name)}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
  );

const Welcome = () => {

    const { connectWallet, currentAccount, formData, handleChange, sendTransaction, isLoading} = useContext(TransactionContext)


    const handleSubmit = (e) => {
        const { addressTo, amount } = formData;

        e.preventDefault();

        if (!addressTo || !amount) return;

        sendTransaction();
    }

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex flex-col items-start justify-between py-12 px-4">
                <div className="flex flex-1 justify-center items-center flex-col">
                    <h1 className="text-3xl sm:text-5xl text-white py-1">
                        Send Ethereum <br /> across the world
                    </h1>
                    {!currentAccount && (
                    <button
                        type="button"
                        onClick={connectWallet}
                        className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]">
                        <p className="text-white text-base font-semibold">
                            Connect Wallet
                        </p>
                    </button>
                    )}
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <Input className="border-[#3d4f7c]" placeholder="Address To" name="addressTo" type="text" handleChange={handleChange}  />
                        <Input className="border-[#3d4f7c]" placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} />

                        {isLoading ?(
                            <Loader />
                        ) : (
                            <button 
                            type="button"
                            onClick={handleSubmit}
                            className="text-white w-full border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
                            >
                                Send Now
                            </button>
                        )
                    }

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Welcome;