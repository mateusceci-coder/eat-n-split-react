import { useState } from 'react';
import './App.css'

/* const friendsArr = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
 */
export default function App() {
  const [friendsList, setFriendsList] = useState([])
  const [isSelect, setIsSelect] = useState("")
  const [isOpen, setIsOpen] = useState(false)


  function handleFriendsList(newFriend) {
    setFriendsList((prevList) => [...prevList, newFriend])
  }

  function handleFriendSelect(id) {
    setIsSelect(friendsList.find((friend) => friend.id === id))
  }
  
  function updateBalance(friend){
    setFriendsList((prevList) => prevList.map((f) => {
      if(friend.id === f.id){
        return friend
      }
      return f
    }))
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList friends={friendsList} isSelect={isSelect} setIsOpen={setIsOpen} onSelect={handleFriendSelect} />
        <AddNewFriend addFriend={handleFriendsList}/>
      </div>
        <SplitBill friend={isSelect} isOpen={isOpen} onUpdateBalance={updateBalance}/>
    </div>
  )
}

function FriendsList({friends, onSelect, isSelect, setIsOpen}) {
  return (
      <ul>
        {friends.length === 0 ? <h1>Start adding friends!</h1> : friends.map((friend)=> <Friend setIsOpen={setIsOpen} isSelect={isSelect} key={friend.id} onSelect={onSelect} friend={friend} />)}
      </ul>
  )
}

function Friend ( {friend, onSelect, isSelect, setIsOpen} ) {

  function handleFriend(id){
    onSelect(id)
    setIsOpen((e) => !e)
  }

  return (
    <li className={isSelect === friend ? "selected" : ""} >
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className='red'>{`You owe ${friend.name} $${Math.abs(friend.balance)}`}</p>} 
      {friend.balance > 0 && <p className='green'>{`${friend.name} owes you $${friend.balance}`}</p>}
      {friend.balance === 0 && <p>{`${friend.name} and you are even`}</p>}
      <button className='button'onClick={() => handleFriend(friend.id)}>{isSelect === friend ? "Close" : "Select"}</button>
    </li>
  )
}

function AddNewFriend({addFriend}) {
  const [isAddingFriend, setIsAddingFriend] = useState(false)
  const [name, setName] = useState("")
  const [image, setImage] = useState("")

  function addNewFriend(ev) {
    ev.preventDefault()
    const newFriend = { name, image, balance: 0, id: Date.now()}
    addFriend(newFriend)
    setImage("")
    setName("")
  }

  function toggleAddingFriend() {
    setIsAddingFriend((add) => !add)
  }

  return (
    <div>
        {isAddingFriend ? (
      <form className='form-add-friend' onSubmit={addNewFriend}>
        <label>🧑‍🤝‍🧑 Friend name </label>
        <input type='text' value={name} onChange={((e) => setName(e.target.value))} />

        <label>🌄 Image Url</label> 
        <input type='text' value={image} onChange={((e) => setImage(e.target.value))}/>
        
        <button className='button'>Add</button>
      </form>
  ) :  <button className='button' onClick={toggleAddingFriend}>Add new Friend</button> }
    </div>
  )
}

function SplitBill({friend, onUpdateBalance, isOpen}) {
  const [formData, setFormData] = useState({})

  function handleBill(ev) {
    setFormData({
      ...formData,
      bill: ev.target.value
    })
  }

  function handleMyExpense(ev) {
    setFormData({
      ...formData,
      myExpense: ev.target.value
    })
  }

  function handlePayer(ev) {
    setFormData({
      ...formData,
      payer: ev.target.value
    })
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (friend.name === formData.payer){
      friend.balance -= friendExpense
      onUpdateBalance(friend)
    }
    else {
      friend.balance += friendExpense
      onUpdateBalance(friend)
    }
  }

  const friendExpense = isNaN(formData.bill - formData.myExpense) ? "" : formData.bill - formData.myExpense

  return (
    <>
    { isOpen &&
      <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {friend.name}</h2>
      <span>💰 Bill Value</span>
      <input value={formData.bill} onChange={handleBill}></input>

      <span >🧍 Your expanse</span>
      <input value={formData.myExpense} onChange={handleMyExpense} ></input>

      <span>{`🧑‍🤝‍🧑 ${friend.name} expense`}</span>
      <input value={friendExpense} readOnly></input>

      <span>🤑 Who is paying the bill?</span>
      <select value={formData.payer} onChange={handlePayer} >
        <option>You</option>
        <option>{`${friend.name}`}</option>
      </select>

      <button className='button'>Split Bill</button>
      </form>
      }
    </>
  )
}