import React from "react";
import classes from "./header.module.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import userIcon from "../../assets/icons/userIcon.svg";
import Bell from "../../assets/icons/Bell.svg";
import { useUser } from "../../context/UserContext";
import coinIcon from "../../assets/icons/coin.png";

const Header = (props) => {
  const cookie = Cookies.get("auth");
  const user = useUser();


  return (
    <>
      <header className={classes.header}>
        <div className={classes.left_header}>
          <h1 className={classes.crypto_text}>KALM</h1>
          {user.user.username !== "" && user.user?.balance !== undefined && (
            <div className={classes.balanceBox}>
              <img src={coinIcon} alt="Баланс" className={classes.coinIcon} />
              <span className={classes.balanceText}>
                {user.user.balance?.toLocaleString() ?? 0}
              </span>
            </div>
          )}
        </div>
        <div className={classes.right_header}>
          {user.user.username !== "" && (
            <>
              <Link to="/MainAuthPage" className={classes.links}>
                Главная
              </Link>
              <Link to="/search" className={classes.links}>
                Преподаватели
              </Link>
              <Link to="/Survey" className={classes.links}>
                Опросы
              </Link>
            </>
          )}
        </div>
        <Link to="/Cabinet">
          <button
            className={classes.profileIcon}
            disabled={!user.user.username}
          >
            <img src={userIcon} alt="Профиль" className={classes.iconImage} />
          </button>
        </Link>
      </header>
    </>
  );
};

// function Header() {
//     return (
//         <div className={styles.header}>
//             <div className={styles.labels_text}>
//                 <p className={styles.crypto_text}>KALM</p>
//                 <div className={styles.right_text}>
//                 { <UserIcon className={styles.user_icon} />}
//                 <img src = "../assets/icons/userIcon.svg"></img>
//                 </div>
//             </div>
//             <div className={styles.palka}></div>
//         </div>
//         // <head class="header">
//         //     <img src=""></img>
//         //     <div>
//         //         <ul>
//         //             <li>
//         //                 <button></button>
//         //             </li>
//         //             <li>
//         //                 <button></button>
//         //             </li>
//         //             <li>
//         //                 <button></button>
//         //             </li>
//         //             <li>
//         //                 <button>
//         //                     <img src= ""></img>
//         //                 </button>
//         //             </li>
//         //         </ul>
//         //     </div>
//         // </head>
//     );
// }
export default Header;
