import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Alerts from './components/layout/Alerts'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PrivateRoute from './components/pages/PrivateRoute'
import Register from './components/pages/Register'
import AlertState from './context/alert/AlertState'
import AuthState from './context/auth/AuthState'
import ClientState from './context/client/ClientState'
import WorkoutState from './context/workout/WorkoutState'
import useToggle from './hooks/useToggle'

const App = () => {
  const [dark, toggleDark] = useToggle(
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [isDrawerOpen, toggleDrawer] = useToggle(false)
  const [showBackground, toggleBackground] = useToggle(true)
  useEffect(() => {
    toggleDrawer(false)
    getSavedPreferences()
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    saveDarkPreference(dark)
    // eslint-disable-next-line
  }, [dark])
  useEffect(() => {
    saveBgPreference(showBackground)
    // eslint-disable-next-line
  }, [showBackground])
  const LOCAL_STORAGE_KEY = 'max_wellness_'
  const DARK_KEY = `${LOCAL_STORAGE_KEY}prefers_dark`
  const BG_KEY = `${LOCAL_STORAGE_KEY}prefers_bg`
  const saveDarkPreference = bool =>
    window.localStorage.setItem(DARK_KEY, JSON.stringify(bool))
  const saveBgPreference = bool =>
    window.localStorage.setItem(BG_KEY, JSON.stringify(bool))
  const getSavedPreferences = () => {
    const darkSetting = JSON.parse(window.localStorage.getItem(DARK_KEY))
    if (typeof darkSetting === 'boolean') toggleDark(darkSetting)
    const bgSetting = JSON.parse(window.localStorage.getItem(BG_KEY))
    if (typeof bgSetting === 'boolean') toggleBackground(bgSetting)
  }
  return (
    <div
      className={`app ${dark ? 'dark' : ''}
        ${showBackground ? 'show-bg' : ''}`}>
      <AuthState>
        <ClientState>
          <WorkoutState>
            <AlertState>
              <Router>
                <Navbar
                  dark={dark}
                  toggleDark={toggleDark}
                  showBackground={showBackground}
                  toggleBackground={toggleBackground}
                  isDrawerOpen={isDrawerOpen}
                  toggleDrawer={toggleDrawer}
                />
                <Route
                  render={({ location }) => (
                    <TransitionGroup>
                      <CSSTransition
                        key={location.key}
                        classNames='slide'
                        timeout={350}>
                        <Switch location={location}>
                          <Route exact path='/login' component={Login} />
                          <Route exact path='/register' component={Register} />
                          <PrivateRoute exact path='/' component={Home} />
                          <PrivateRoute path='/:id' component={Home} />
                        </Switch>
                      </CSSTransition>
                    </TransitionGroup>
                  )}
                />
              </Router>
              <Footer />
              <Alerts />
            </AlertState>
          </WorkoutState>
        </ClientState>
      </AuthState>
    </div>
  )
}

export default App
