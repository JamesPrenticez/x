import React, { type ReactElement } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { INavigationItem, Paths } from "@models";
import Avatar from "./Avatar";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { Button } from "@components/ui";
import CompanyName from "./CompanyName";
import { logoutUser } from "@redux/slices";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuItems: INavigationItem[];
}

function RightNav({ isMenuOpen, setIsMenuOpen, menuItems }: Props): ReactElement {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  return (
    <div
      className={`fixed inset-[60px_0_0_0] md:inset-[80px_0_0_0] bg-tarantula/80 z-50 
        ${isMenuOpen ? "block" : "hidden"}
      `}
    >
      <div className="absolute right-0 bg-tarantula h-full w-full md:w-[450px] p-6 space-y-2 text-muted flex flex-col">
        <div className="flex flex-col grow">
          <CompanyName />

          {user.data && (
            <div className="flex mt-6">
              <Avatar />
              <div className="ml-6">
                <h2 className="text-lg font-bold">
                  {user.data.firstName} {user.data.lastName}
                </h2>
                <h3>{user.data.email}</h3>
              </div>
            </div>
          )}

          <div className="pt-6 select-none">
            {menuItems

              .filter((item: INavigationItem) => user.data.email !== "")
              .map((item: INavigationItem, index: any) => {
                let slug;
                slug = `/${item.path}`;

                if (user.data) {
                  slug = `/user/${user.data.id}/${item.path}`;
                }

                return (
                  <NavLink
                    key={index}
                    to={slug}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex space-x-4 py-2 hover:text-white font-medium
                      ${location.pathname === slug ? "text-major hover:text-major" : "text-muted"}
                    `}
                  >
                    <span className="flex items-center text-major">{item.icon}</span>
                    <p>{item.name}</p>
                  </NavLink>
                );
              })}
          </div>
        </div>

        <div>
          {user.isAuthenticated ? (
            <NavLink to={Paths.HOME}>
              <Button 
                variant="outlined"
                color="error"
                className="w-full"
                onClick={() => {
                  dispatch(logoutUser());
                  setIsMenuOpen(false);
                }}
              >
                Sign Out
              </Button>
            </NavLink>
          ) : (
              <NavLink to={Paths.LOGIN}>
              <Button 
                variant="outlined"
                color="major"
                className="w-full text-major"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightNav;
