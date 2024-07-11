import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense, useEffect, useState } from "react";
import store from "./store";
const NotFound = lazy(() => import("./Pages/NotFound"));
const BlogLiked = lazy(() => import("./components/BlogLiked"));
const ProfileComponent = lazy(() => import("./components/ProfileComponent"));
const MyBlog = lazy(() => import("./components/MyBlog"));
const ProtectedRoute = lazy(() => import("./utils/ProtectedRoute"));
const HomePage = lazy(() => import("./Pages/HomePage"));
const AddBlog = lazy(() => import("./Pages/AddBlog"));
const ProfilePage = lazy(() => import("./Pages/Profile"));
const Signup = lazy(() => import("./Pages/Signup"));
const Navbar = lazy(() => import("./components/Navbar"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const Spinner = lazy(() => import("./components/Spinner"));
const BlogDetail = lazy(() => import("./Pages/BlogDetail"));
const EditBlog = lazy(() => import("./components/EditBlog"));
import { useCookies, CookiesProvider } from "react-cookie";
function App() {
  const [myCookies, setMyCookies] = useCookies(["accessToken"]);
  useEffect(() => {
    console.log(myCookies);
    //setMyCookies("userDtail", "", { path: "/" });
    console.log("second  ", myCookies);

    if (!myCookies) {
      localStorage.removeItem("userDetail", myCookies);
      console.log("first ");
    }
  }, []);

  return (
    <CookiesProvider>
      <Suspense fallback={<Spinner />}>
        <main className="w-full min-h-screen  bg-[#f2f3f4] text-black/40   ">
          <Provider store={store}>
            <BrowserRouter>
              <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              <Navbar />
              <Routes>
                <Route path={"/"} element={<HomePage />} />
                <Route path={"/login"} element={<LoginPage />} />
                <Route path={"/signup"} element={<Signup />} />
                <Route path={"/blog/:blogid"} element={<BlogDetail />} />
                <Route path="*" element={<NotFound />} />
                <Route element={<ProtectedRoute />}>
                  <Route path={"/addblog"} element={<AddBlog />} />
                </Route>
                <Route element={<ProtectedRoute />} path={"/"}>
                  <Route path={"profile"} element={<ProfilePage />}>
                    <Route path="me" element={<ProfileComponent />} />
                    <Route path="">
                      <Route
                        path="myblogs/edit/:blogId"
                        element={<EditBlog />}
                      />
                      d <Route path="myblogs" element={<MyBlog />} />
                    </Route>

                    <Route path="blogLiked" element={<BlogLiked />} />
                    <Route path="logout" element={<h1>Logout </h1>} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </Provider>
        </main>
      </Suspense>
    </CookiesProvider>
  );
}

export default App;
