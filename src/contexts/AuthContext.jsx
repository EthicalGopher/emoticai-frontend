// Save user to localStorage whenever it changes
useEffect(() => {
  if (user) {
    // Only save non-guest users to localStorage
    if (!user.isGuest) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  } else {
    localStorage.removeItem("user");
  }
}, [user]);