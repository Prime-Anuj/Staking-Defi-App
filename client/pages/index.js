import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import WithdrawTokens from "../components/WithdrawTokens";
import StakeDetails from "../components/StakeDetails";
import StakeForm from "../components/StakeForm";

export default function Home() {
  return (
    <div className="gap-10 p-10  h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex flex-col">
    
        <Header />
        <StakeForm />
        <WithdrawTokens/>
        <StakeDetails />
        
    </div>
  );
}
