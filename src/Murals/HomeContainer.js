import React from 'react';
import Murals from './MuralList'
import MuralSearch from './MuralSearch'
import ShowMural from './ShowMural'
import UserShow from '../Users/UserShow'
import Logo from '../Logo/artInTheWild.jpg'
import { Route, Switch } from 'react-router-dom'

class MuralContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      murals: [],
      showMural: false,
      showUser: false,
      muralObj: {},
      muralId: '',
      userObj: {},
    }
  }

  componentDidMount(){
    this.getMurals()  
  }

  getMurals = async () => {
    try{
      const foundMurals = await 
      fetch(process.env.REACT_APP_BACKEND_URL + '/murals/home', {
        credentials: 'include',
        method: 'GET'
      });
      if(foundMurals.status !== 200){
        throw Error(foundMurals.statusText)
      }
      const muralsParsed = await foundMurals.json();
      this.setState({murals: muralsParsed.murals})
    }
    catch(error){
      console.log(error);
      return error
    }    
  }

  searchMurals = async (search, event) => {
    event.preventDefault()
    try{
      const foundMurals = await 
      fetch(`${process.env.REACT_APP_BACKEND_URL}/murals/${search.searchProperty}/${search.searchTerm}`, {
        credentials: 'include',
        method: 'GET'
      })
      if(foundMurals.status !== 200){
        throw Error(foundMurals.statusText)
      }
      const muralsParsed = await foundMurals.json()
      this.setState({
        murals: muralsParsed.murals,
        showSearch: true
      })
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  deleteUser = async (id, event) => {
    console.log('hitting deleteUser');
    event.preventDefault()
    try{
      const deleteUser = await
      fetch(process.env.REACT_APP_BACKEND_URL + '/users/user/' + id, {
        credentials: 'include',
        method: 'DELETE'
      })
      if(deleteUser.status !== 200){
        throw Error(deleteUser.statusText)
      }
      const parsedResponse = await deleteUser.json()
      console.log(parsedResponse);
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  showMuralModal = (id, event) => {
    const muralToShow = this.state.murals.find((mural) => mural._id === id)
    this.setState({
      showMural: true,
      muralId: id,
      muralObj: muralToShow
    })
    this.props.history.push('/mural')
  }

  render(){
    let mural;
    let user;
    let search = <MuralSearch
            searchMurals={this.searchMurals}
          />
    let list = <Murals 
            murals={this.state.murals}            
            showMuralModal={this.showMuralModal}
          />
    if(this.state.showMural){
      mural = <ShowMural 
          muralObj={this.state.muralObj}
          showEditModal={this.showEditModal}
          deleteMural={this.deleteMural}
          showUserModal={this.showUserModal}
        />
        list = ''
        search = ''
    }
    if(this.state.showUser){
      user = <UserShow
          userObj={this.state.userObj}
          deleteUser={this.deleteUser}
        />
      list = ''
      search = ''
    }
    return(
      <div className="home">
      <img src={Logo}/>
        {search}
        {mural}
        {list}
        {user}
      </div>
    )
  }
    // return (
    //   <main>
    //     <Switch>
    //       <Route exact path="/search" render={(props) => 
    //         <MuralSearch{...props} searchMurals={this.searchMurals} />}
    //       />
    //       <Route exact path="/mural" render={(props) => 
    //         <ShowMural {...props} muralObj={this.state.muralObj} />} 
    //       />
    //     </Switch>
    //   </main>
    // );
}

export default MuralContainer;