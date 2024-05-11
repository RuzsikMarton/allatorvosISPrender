import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import {Button, Col, Navbar, NavDropdown, Row} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import {useContext} from "react";
import {Site} from "./Site";
import OwnedAnimalsScreen from "./screens/OwnedAnimalsScreen";
import AddAnimalScreen from "./screens/AddAnimalScreen";
import AnimalScreen from "./screens/AnimalScreen";
import UserProfileScreen from "./screens/userProfileScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import EmployeeListScreen from "./screens/EmployeeListScreen";
import AnimalListScreen from "./screens/AnimalListScreen";
import EmployeeRoute from "./components/EmployeeRoute";
import AnimalEditScreen from "./screens/AnimalEditScreen";
import ListUserAnimalsScreen from "./screens/ListUserAnimalsScreen";
import OrderListScreen from "./screens/OrderListScreen";
import CreateOrderScreen from "./screens/CreateOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import DashboardScreen from "./screens/DashboardScreen";

function App() {
    const {state, dispatch: ctxDispatch} = useContext(Site);
    const {userInfo} = state;

    const signoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT'});
        localStorage.removeItem('userInfo');
        window.location.href = '/signin';
    }

  return (
      <BrowserRouter>
          <div className="d-flex flex-column site-container">
              <header>
                  <Navbar bg={"dark"} variant={"dark"} expand={'lg'}>
                      <Col md={1}></Col>
                      <Col md={8}>
                          <LinkContainer to={"/"}>
                              <Navbar.Brand>Főoldal</Navbar.Brand>
                          </LinkContainer>
                          {userInfo ? (
                              <LinkContainer to={"/addanimal"}>
                                  <Navbar.Brand>Állat regisztrálása</Navbar.Brand>
                              </LinkContainer>
                          ) : (<div></div>)}
                      </Col>
                      {userInfo && userInfo.isEmployee && !userInfo.isAdmin && (
                          <Col md={1}>
                              <NavDropdown title={"Alkalmazott"} id={"admin-nav-dropdown"}>
                                  <LinkContainer to={"/employee/animalList"}>
                                      <NavDropdown.Item>Állatok</NavDropdown.Item>
                                  </LinkContainer>
                                  <LinkContainer to={"/employee/orderList"}>
                                      <NavDropdown.Item>Számlák</NavDropdown.Item>
                                  </LinkContainer>
                              </NavDropdown>
                          </Col>
                      )}
                      {userInfo && userInfo.isAdmin && (
                          <Col md={1}>
                              <NavDropdown title={"Admin"} id={"admin-nav-dropdown"}>
                                  <LinkContainer to={"/admin/dashboard"}>
                                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                                  </LinkContainer>
                                  <LinkContainer to={"/admin/userList"}>
                                      <NavDropdown.Item>Felhasználók</NavDropdown.Item>
                                  </LinkContainer>
                                  <LinkContainer to={"/admin/employeeList"}>
                                      <NavDropdown.Item>Alkalmazottak</NavDropdown.Item>
                                  </LinkContainer>
                                  <LinkContainer to={"/employee/animalList"}>
                                      <NavDropdown.Item>Állatok</NavDropdown.Item>
                                  </LinkContainer>
                                  <LinkContainer to={"/employee/orderList"}>
                                      <NavDropdown.Item>Számlák</NavDropdown.Item>
                                  </LinkContainer>
                              </NavDropdown>
                          </Col>
                      )}
                      {userInfo ? (
                              <Col md={1}>
                                  <NavDropdown title={userInfo.name}>
                                      <LinkContainer to={"/profile"}>
                                          <NavDropdown.Item>Felhasználó Profil</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to={"/ownedanimals"}>
                                          <NavDropdown.Item>Állataim</NavDropdown.Item>
                                      </LinkContainer>
                                      <NavDropdown.Divider />
                                      <NavDropdown.Item onClick={signoutHandler}>Kijelentkezés</NavDropdown.Item>
                                  </NavDropdown>
                              </Col>
                      ) : (
                          <>
                              <Col md={1}></Col>
                          <Col md={1}>
                              <LinkContainer to={"/signin"}><Button variant={"primary"}>Bejelentkezés</Button></LinkContainer> {' '}
                          </Col>
                              <Col md={1}></Col>
                          </>
                      )}
                  </Navbar>
              </header>
              <main>
                  <Routes>
                      <Route path={"/"} element={<HomeScreen />}></Route>
                      <Route path={"/signin"} element={<SigninScreen />}></Route>
                      <Route path={"/signup"} element={<SignupScreen />}></Route>
                      <Route path={"/addanimal"} element={<AddAnimalScreen></AddAnimalScreen>}></Route>
                      <Route path={"/animal/:id"} element={<AnimalScreen></AnimalScreen>}></Route>
                      <Route
                          path="/profile"
                          element={
                              <ProtectedRoute>
                                  <UserProfileScreen />
                              </ProtectedRoute>
                          }
                      />
                      <Route path={"/ownedanimals"} element={<ProtectedRoute><OwnedAnimalsScreen></OwnedAnimalsScreen></ProtectedRoute>}></Route>
                      <Route path={"/order/:id"} element={<ProtectedRoute><OrderScreen></OrderScreen></ProtectedRoute>}></Route>
                      {/*Employee Routes*/}
                      <Route path={"/employee/animalList"} element={<EmployeeRoute><AnimalListScreen></AnimalListScreen></EmployeeRoute>}></Route>
                      <Route path={"/employee/orderList"} element={<EmployeeRoute><OrderListScreen></OrderListScreen></EmployeeRoute>}></Route>
                      <Route path={"/employee/animal/:id"} element={<EmployeeRoute><AnimalEditScreen></AnimalEditScreen></EmployeeRoute>}></Route>
                      <Route path={"/employee/animalList/:id"} element={<EmployeeRoute><ListUserAnimalsScreen></ListUserAnimalsScreen></EmployeeRoute>}></Route>
                      <Route path={"/employee/createorder/:id"} element={<EmployeeRoute><CreateOrderScreen></CreateOrderScreen></EmployeeRoute>}></Route>
                      {/*Admin Routes*/}
                      <Route path={"/admin/userList"} element={<AdminRoute><UserListScreen></UserListScreen></AdminRoute>}></Route>
                      <Route path={"/admin/employeeList"} element={<AdminRoute><EmployeeListScreen></EmployeeListScreen></AdminRoute>}></Route>
                      <Route path={"/admin/user/:id"} element={<AdminRoute><UserEditScreen></UserEditScreen></AdminRoute>}></Route>
                      <Route path={"/admin/dashboard"} element={<AdminRoute><DashboardScreen></DashboardScreen></AdminRoute>}></Route>
                  </Routes>
              </main>
              <footer className="bg-dark text-light py-4">
                  <Row>
                      <Col md={1}></Col>
                      <Col md={4}>
                          <p>Utca: Nitrianska cesta 10</p>
                          <p>Város: Nové Zámky</p>
                      </Col>
                      <Col md={4}>
                          <p>© 2024 Minden jog fenntartva</p>
                      </Col>
                      <Col md={3}>
                          <p>Telefonszám: +421 907 123 456</p>
                          <p>E-mail: info@example.com</p>
                      </Col>
                  </Row>
              </footer>
          </div>
      </BrowserRouter>
  );
}

export default App;
