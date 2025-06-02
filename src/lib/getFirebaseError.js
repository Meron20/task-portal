
export const getErrorMessage = (errorCode) => {
    switch(errorCode){
        case "auth/email-already-in-use":
          return "E-postadressen används redan av ett annat konto," ;
          case "auth/invalid-credential":
            return "Fel e-postadress eller lösenord." ;
            case "auth/weak-password":
                return "Lösenordet är för svagt. Vänligen välja ett starkare lösenord." ;

      default: 
        return "Ett okänt fel inträffade. Försök igen senare"
    }
    
}