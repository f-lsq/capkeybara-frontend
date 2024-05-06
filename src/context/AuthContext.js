import React, {createContext} from 'react';

export const AuthContext = createContext();

export default function AuthContextData({children}) {
  
  const serviceOperations = {
    login: (data, role) => {
      localStorage.setItem("role", role)
      localStorage.setItem("id", data.id)
      localStorage.setItem("username", data.username)
      localStorage.setItem("email", data.email)
      localStorage.setItem("accessToken", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("loginStatus", true)
    },

    logout: () => {
      localStorage.removeItem("role")
      localStorage.removeItem("id")
      localStorage.removeItem("username")
      localStorage.removeItem("email")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("loginStatus")

    }
  }

  return (
    <AuthContext.Provider value={serviceOperations}>
      {children}
    </AuthContext.Provider>
  )

}