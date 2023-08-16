import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Auth0Provider} from "@auth0/auth0-react";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Auth0Provider domain="dev-8y-bvmag.us.auth0.com"
                   clientId="Cp20JtOZ59rhwPeHVxuUyz5jN59U2WlP"

                   authorizationParams={{
                       redirect_uri: window.location.origin,
                       audience : "https://quickstarts/api",
                       scope : "read:messages openid email profile"
                   }} >
        <App/>
    </Auth0Provider>
)
