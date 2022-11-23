import React, { Fragment, useEffect, useState } from 'react'
import Axios from './Axios'
import Swal from 'sweetalert2';
import { Link, useHistory } from 'react-router-dom';

function AddUser() {
	const [roleList, setroleList] = useState([]);
	const [roleListCheckbox, setRoleListCheckbox] = useState([]);
	const [formInput, setFormInput] = useState({
		full_name: '',
		email: '',
		error_list: []
	})
	const history = useHistory();
	//get role data for checkbox
	const getRoles = async (url) => {
		await Axios.get(url).then(response => {
			if (response.status === 200) {
				setroleList(response.data.roles);
			}
		})
	}
	//input field handler
	const handleInput = (e) => {
		e.persist();
		setFormInput({ ...formInput, [e.target.name]: e.target.value })
	}
	const checkboxHandler = (e, items) => {
		e.persist();
		const { checked } = e.target;
		const checkbox = roleListCheckbox;
		if (checked) {
			checkbox.push(items.id);
		} else {
			checkbox.splice(checkbox.indexOf(items.id), 1)
		}
		setRoleListCheckbox(checkbox)
	}



	let rolesData = '';
	if (roleList.length > 0) {
		rolesData = roleList.map((val, index) => {
			return (
				<div key={val.id}>
					<input
						type='checkbox'
						onChange={(e) => checkboxHandler(e, val)}
						name={`role_id_${index}`}
					/> <span>{val.name}</span>
				</div>

			)
		})
	}

	//form submit 
	const submitForm = (e) => {
		e.preventDefault();
		const data = {
			full_name: formInput.full_name,
			email: formInput.email,
			role_id: roleListCheckbox
		}
		console.log(data)
		Axios.post(`api/store-user`, data)
			.then(response => {
				if (response.status === 200) {
					Swal.fire({
						title: 'Success!',
						text: response.data.message,
						icon: 'success',
					})
					history.push('/')
				}
			})
			.catch(({ response }) => {
				if (response.status === 422) {
					setFormInput({ ...formInput, error_list: response.data.errors })
				}
			});
	}
	useEffect(() => {
		getRoles(`api/role-list`);
	}, [])
	return (
		<Fragment>
			<div className='container py-5'>
				<div className='row justify-content-center'>
					<div className='col-md-6'>
						<div className='card'>
							<div className='card-header'>
								<h4>Add User</h4>
							</div>
							<div className='card-body'>
								<form onSubmit={submitForm}>
									<div className='form-group mb-2'>
										<label>Full Name</label>
										<input
											type='text'
											name='full_name'
											className='form-control'
											autoComplete='off'
											value={formInput.full_name}
											onChange={handleInput}
										/>
									</div>
									<span className='text-danger'>{formInput.error_list.full_name}</span>
									<div className='form-group mb-2'>
										<label>Email</label>
										<input
											type='text'
											name='email'
											className='form-control'
											autoComplete='off'
											value={formInput.email}
											onChange={handleInput}
										/>
									</div>
									<span className='text-danger'>{formInput.error_list.email}</span>
									<div className='form-group mb-2'>
										{rolesData}
										<span className='text-danger'>{formInput.error_list.role_id}</span>
									</div>

									<div className='form-group mt-3'>
										<button type='submit' className='btn-sm btn btn-primary'>Save</button>
										| <Link to="/" className='btn-sm btn btn-primary'>Back</Link>
									</div>
								</form>
							</div>
						</div>

					</div>
				</div>
			</div>
		</Fragment>

	)
}

export default AddUser
