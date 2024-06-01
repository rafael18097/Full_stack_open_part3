import { useState,useEffect } from 'react'
import services from './services/services'

const Filter=({search,handleSearchChange})=>{
  return(
    <form>
        filter shown with <input value={search} onChange={handleSearchChange}/>
      </form>
  )

}

const Personform=({addContact,newName,handleNameChange,newPhone,handlePhoneChange})=>{

  return(<form onSubmit={addContact}>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      phone: <input value={newPhone} onChange={handlePhoneChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>)
}
const deleteName=(name,id,setErrorMessage,setGoodMessage)=>{
  services.removedb(id)
  .then((response) =>{
    setGoodMessage(`Contact ${name} has been deleted`)
    setTimeout(() => {
          setGoodMessage(null)
          
        }, 5000)

    console.log(response.data)})
    
    
  .catch((error)=>{
      setErrorMessage(`contact ${name} does not exist or it has already been removed`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log(error)
    })
  
}
const SearchPerson=({persons,search,setErrorMessage,setGoodMessage})=>{

  const Search= persons.filter((persons)=>persons.name.toLowerCase().includes(search.toLowerCase()))
  
  const filterContact=Search.map((Search)=>
  <div key={Search.id}>
    {Search.name}  {Search.phone} <div>
    <button type='Delete' onClick={()=>{
      if(window.confirm(`do you really want to delete ${Search.name} ?`)){
        
        return(deleteName(Search.name,Search.id,setErrorMessage,setGoodMessage)
        
        
        
        )
        }
        }
      }>
    delete</button></div></div>)
    return(
      filterContact
    )



}

const GoodNotification = ({ message }) => {
  if (message === null|| message==='') {
    return null
  }

  return (
    <div className='Good'>
      {message}
    </div>
  )
}

const BadNotification = ({ message }) => {
  if (message === null|| message==='') {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [goodMessage, setGoodMessage] = useState('')
  

  
  useEffect(()=>{
    services.getdb()
    .then(response=>{
      setPersons(response.data)
      

    })
  },[])
  


  const addContact=(event)=>{
    event.preventDefault()
    console.log('button clicked',newName+newPhone)
    const dupperson= persons.filter((persons)=>persons.name===newName)
    
    const dupname=dupperson.map(dupperson=>dupperson.name)
    const dupphone= persons.filter((persons)=>persons.phone===newPhone)
    const dupphones=dupphone.map(dupphone=>dupphone.phone)
    const repid=dupperson.map(dupperson=>dupperson.id)
    if (newName===dupname[0]||newPhone===dupphones[0] ){
      if(newPhone===dupphones[0]&& newName===dupname[0]){
        alert(` ${newPhone} is already in the phonebook for contact ${newName} `)
        setErrorMessage(` ${newPhone} is already in the phonebook for contact ${newName} `)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      
      }
      if(newName===dupname[0]&&newPhone!==dupphones[0]){
        if(window.confirm(`${newName} already exists do you want to replace the old number with ${newPhone}`)){
          const nameObject={
            name: newName,
            id: repid,
            phone:newPhone
          }
          services.updatedb(repid,nameObject)
          .then(response=>{
            
            setGoodMessage(`Contact ${response.data.name} phone is now ${response.data.phone}`)
            setTimeout(() => {
              setGoodMessage(null)
            }, 5000)

          })
          .catch((error)=>{
            setErrorMessage(`contact ${newName} does not exist or it has already been removed`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            console.log(error)
          })
        }
      }  
    }
    else{
    const nameObject={
      name: newName,
      id: String(persons.length+1),
      phone:newPhone
    }

    services.insertdb(nameObject)
    .then(response=>{
        setPersons(persons.concat(response.data))
        setGoodMessage(`${newName} added to the phonebook with phone :${newPhone}`)
        setTimeout(() => {
          setGoodMessage(null)
        }, 5000)
    })
    
    setNewName('')
    setNewPhone('')
  }
}

  const handleNameChange =(event)=>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handlePhoneChange =(event)=>{
    console.log(event.target.value)
    setNewPhone(event.target.value)

  }
  const handleSearchChange=(event)=>{
    console.log(event.target.value)
    setSearch(event.target.value)
  }
  


  return (
    <div>
      <h1>PhoneBook</h1>
      <GoodNotification message={goodMessage}/>
      <BadNotification message={errorMessage}/>
      <Filter search={search} handleSearchChange={handleSearchChange}/>
      <h2>add a new</h2>
      <Personform addContact={addContact} newName={newName} handleNameChange={handleNameChange}newPhone={newPhone}handlePhoneChange={handlePhoneChange}/>
      <h2>Numbers</h2>
      <SearchPerson persons={persons} search={search} setGoodMessage={setGoodMessage} setErrorMessage={setErrorMessage}/>
       
    </div>
  )
}

export default App
