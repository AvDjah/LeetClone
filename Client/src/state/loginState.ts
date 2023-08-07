
import {makeAutoObservable} from 'mobx'


class LoginState {
    email : string
    tokenID : string
    loggedIn : boolean
    constructor() {
        makeAutoObservable(this)
        this.email = ""
        this.tokenID = ""
        this.loggedIn = false
    }

    setLoginState(email : string, tokenID : string){
        this.email = email
        this.tokenID = tokenID
        this.loggedIn = true
    }
}


export const loginState = new LoginState()
