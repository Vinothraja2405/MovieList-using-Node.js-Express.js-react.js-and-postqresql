import {useEffect,useState} from "react";
import axios from 'axios';
import './App.css';

function App() {

  
  const [users,setUsers]=useState([]);
  const [filterusers,setFilterusers]=useState([]);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [userData,setUserData]=useState({movie_name:"",description:"",casting:""});

//get function

  const getAllUsers=async()=>{
    await axios.get("http://localhost:5000/users").then((res)=>{
      console.log(res.data);
      setUsers(res.data);
      setFilterusers(res.data);
    });
    
  };
  useEffect(()=>{
    getAllUsers();

  },[]);


//search function

  const handlesearchChange=(e)=>{
      const searchText=e.target.value.toLowerCase();
      const filterUsers=users.filter((users)=>users.movie_name.toLowerCase().includes(searchText) || users.description.toLowerCase().includes(searchText) || users.casting.toLowerCase().includes(searchText));
      setFilterusers(filterUsers)
  };

//delete funtion

  const handleDelete=async(id)=>{
    const isConfirmed=window.confirm("Are you sure want to delete this movie?");
    if(isConfirmed){
    await axios.delete(`http://localhost:5000/users/${id}`).then((res)=>{
      setUsers(res.data);
      setFilterusers(res.data);
    });
  }
  }


//add movie function
const handleAddRecord=()=>{
    setUserData({movie_name:"",description:"",casting:""}); 
    setIsModalOpen(true);
};


//close Form
const closeModal=()=>{
  setIsModalOpen(false);
  getAllUsers();
}


// handle user data change
const handleData = (e) => {
  setUserData({ ...userData, [e.target.name]: e.target.value });
};


//Handle add button
const handleSubmit = async (e) => {
  e.preventDefault();
  const dataToSend = {
    movie_Name: userData.movie_name,  
    description: userData.description,
    casting: userData.casting
  };

  if (userData.id) {
    const id = userData.id;
    try {
      const response = await axios.patch(`http://localhost:5000/users/${id}`, dataToSend); // Send dataToSend
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data); // Log the error response for more details
    }
  } else {
    const response = await axios.post(`http://localhost:5000/users`, dataToSend);
    console.log(response.data);
  }

  closeModal();
  setUserData({ movie_name: "", description: "", casting: "" });
};


//Edit function
const handleUpdateRecord=(users)=>{
  setUserData(users);
  setIsModalOpen(true);

};





  return (
   <>
      <div className="container">
        <h3>Movie application</h3>
      
      <div className="input-search">
        <input type="search"  placeholder="Search Movie Here" onChange={handlesearchChange}/>
        <button className="btn green" onClick={handleAddRecord}>Add Movies</button>
      </div>
      <table className="table">
        <thead>
        <tr>
          
          <th>Movie</th>
          <th>Description</th>
          <th>cast</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
          {
            filterusers && filterusers.map((users)=>{
              return(
                <tr key={users.id}>
                  <td>{users.movie_name}</td>
                  <td>{users.description}</td>
                  <td>{users.casting}</td>
                  <td><button className="btn green" onClick={()=>handleUpdateRecord(users)}>Edit</button></td>


                  <td><button className="btn red" onClick={()=>handleDelete(users.id)}>Delete</button></td>




                </tr>
              )
            })
        }
        </tbody>

      </table>
        {isModalOpen && (
          <div className="modal">
            
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h2>Movies Record</h2>
              <div className="input-group">
                <label htmlFor="name" >MovieName</label>
                <input type="text" value={userData.movie_name} onChange={handleData} name="movie_name" id="name"/>


                <label htmlFor="desc" >Description</label>
                <input type="text" value={userData.description} onChange={handleData} name="description" id="desc"/>


                <label htmlFor="cast" >casting</label>
                <input type="text" value={userData.casting} onChange={handleData} name="casting" id="cast"/>
              </div>
              <button className="btn green" onClick={handleSubmit}>ADD+</button>
            </div>
          </div>
        )}
      </div>
    </>  
  )
}

export default App
