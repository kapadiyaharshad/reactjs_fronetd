import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Axios from './Axios'

function Home() {
  const [userList, setUserList] = useState([]);
  const [roleList, setroleList] = useState([]);
  //get user data
  const getUsers = (url) => {
    Axios.get(url).then(response => {
      if (response.status === 200) {
        setUserList(response.data.users);
      }
    })
  }
  //get role data for dropdown
  const getRoles = (url) => {
    Axios.get(url).then(response => {
      if (response.status === 200) {
        setroleList(response.data.roles);
      }
    }).catch(({ response }) => {
      console.log(response)
    })
  }
  //get user list
  useEffect(() => {
    getUsers(`api/user-list`);
  }, [])
  //get role list
  useEffect(() => {
    getRoles(`api/role-list`);
  }, [])

  const selectHandler = (e) => {
    console.log(e.target.value)
  }

  //show data in table
  let userData = '';
  if (userList.length > 0) {
    userData = userList.map((val, index) => {
      return (
        <tr key={val.id}>
          <td>{++index}</td>
          <td>{val.full_name}</td>
          <td>{val.email}</td>
          <td>
            {
              val.roles.map((items, i) => {
                return <span key={i}>{items.name}&nbsp;</span>
              })
            }
          </td>

        </tr>
      )
    })
  }
  return (
    <Fragment>
      <div className='container px-4 mt-4'>
        <div className="card">
          <div className="card-header">
            <h4><span className='px-2'>Users List</span>
              <Link to="/user" className='float-end btn-sm btn btn-primary'>Add User</Link> </h4>
            <select className="form-control col-md-2 float-right mb-2" id="role_id" name="role" onChange={selectHandler}>
              <option value="all">All</option>
              {
                roleList.map((val) => {
                  return (
                    <option value={val.id} key={val.id}>{val.name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Roles</th>
                </tr>
              </thead>
              <tbody>
                {userList.length > 0 ? userData : <tr className='justify-content-sm-center'><td>Data not found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Home