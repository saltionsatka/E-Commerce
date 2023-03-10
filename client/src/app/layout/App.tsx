import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './Header'
import 'react-toastify/dist/ReactToastify.css'
import agent from '../api/agent'
import { getCookie } from '../util/util'
import LoadingComponent from './LoadingComponent'
import { useAppDispatch } from '../store/configureStore'
import { setBasket } from '../../features/basket/basketSlice'
import { fetchCurrentUser } from '../../features/account/accountSlice'

function App() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const buyerId = getCookie('buyerId')
    dispatch(fetchCurrentUser())
    if (buyerId) {
      agent.Basket.get()
        .then((basket) => dispatch(setBasket(basket)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [dispatch])

  const [darkMode, setDarkMode] = useState(false)
  const paletteType = darkMode ? 'dark' : 'light'
  const darkTheme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212',
      },
    },
  })

  function handleThemeChange() {
    setDarkMode(!darkMode)
  }

  if (loading) return <LoadingComponent message="Initialising app..." />

  return (
    <ThemeProvider theme={darkTheme}>
      <ToastContainer position="top-right" hideProgressBar theme="colored" />
      <CssBaseline /> {/*Removes the margin in all browsers*/}
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
