import Login from "../components/Login";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header from "../components/Header";
import AdminControls from "../components/AdminControls";
import Draw from "../components/Draw";
import CountDown from "../components/CountDown";
import { convertToEth } from "../utils/convert";
import BuyTickets from "../components/BuyTickets";
// import CountDown1 from "../components/CountDown1";
export default function Home() {
  const { account, admin, winner, pastWinner, withdrawWinnings, btnLoading } =
    useContext(AppContext);
  console.log(admin);
  console.log(winner);
  if (!!account)
    return (
      <div>
        <div className="container max-w-5xl flex-col items-center space-y-10 justify-center flex py-10">
          {/* <CountDown1 /> */}
          {pastWinner && pastWinner[0] && pastWinner[1] && (
            <marquee
              className="text-black font-semibold"
              width="100%"
              direction="left"
            >
              {`Last Draw Winner = ${
                pastWinner[0]
              } | Last Draw Winning Amount = ${convertToEth(
                pastWinner[1]
              )} ETH`}
            </marquee>
          )}
          {winner > 0 && (
            <div className="border rounded flex flex-col md:flex-row justify-center md:justify-between items-center p-4 w-full text-center text-xl md:text-2xl space-y-4 md:space-y-0 font-bold bg-yellow-100">
              {`Winner!!! You have won ${convertToEth(winner)} ETH`}
              <button onClick={withdrawWinnings} className="btn border">
                {btnLoading && <div className="loader" />}
                <span>Withdraw</span>
              </button>
            </div>
          )}
          {admin && <AdminControls />}

          <div className="flex flex-col space-y-6 space-x-0 md:space-y-0 md:flex-row mt-10 w-full justify-between md:space-x-10">
            <div className="flex-1">
              <Draw />
            </div>
            <BuyTickets />
          </div>
        </div>
      </div>
    );
  return (
    <div className="container max-w-5xl py-10">
      <AdminControls />
      <div className="flex flex-col space-y-6 space-x-0 md:space-y-0 md:flex-row mt-10 w-full justify-between md:space-x-10">
        <div className="flex-1">
          <Draw />
        </div>
        <BuyTickets />
      </div>
    </div>
  );
}
