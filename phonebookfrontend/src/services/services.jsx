import axios from 'axios'
const baseUrl = '/api/persons'

const getdb =()=>{
    console.log('GET effect')
    return axios.get(baseUrl)
}
  
const insertdb=(props)=>{
    console.log('POST effect')
    return axios.post(baseUrl,props)
}

const removedb=(props)=>{
    console.log('DELETE effect')
    return axios.delete(`${baseUrl}/${props}`)
}

const updatedb=(id,nameObject)=>{
    console.log('PUT effect')
    return axios.put(`${baseUrl}/${id}`,nameObject)
}

export default {
    getdb,
    insertdb,
    removedb,
    updatedb
}