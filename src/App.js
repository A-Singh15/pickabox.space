import './App.css';
import InfoBox from './component/InfoBox';
import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect } from 'react';
import logo from './image/boxIcon.png';
import Button from 'react-bootstrap/Button';
import Modal from 'react-modal';
import AboutModal from './component/AboutModal';
import useLoader from './component/useLoader';


// Title rotation
const words = ["Bored?    ", "Pick A Box", "Shuffle, Rabbithole, and Repeat"];

export default function App() {
  
  const [articleData, setArticleData] = useState();

  // React Hooks

  // Type writer Effects
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  // Subtitle
  const [subTitle, setSubTitles] = useState('');
  const [titleLink, setTitleLink] = useState('');
  const [titleId, setId] = useState('');

  // Modal
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // State showing whether reshuffle button exist or not
  const [reShuffle, setReshuffle] = useState(false);

  // Spinning screen for loading
  const [loader, showLoader, hideLoader] = useLoader();
  

  // About Modal
  const setAboutModalIsOpenToTrue = () => {
    setModalIsOpen(true)
  }

  const setAboutModalIsOpenToFalse =()=>{
    setModalIsOpen(false)
  }

  // onHover Events
  const [isShown, setIsShown] = useState(false);



  // Link Handler
  useEffect(() => {
    clickHandler();
  }, []);
  
  // Type Writer Effect (hz)
  useEffect(() => {
    
    // Check done typing all words
    if (index === words.length) return;

    // Checks if need to reverse, otherwise no
    if ( subIndex === words[index].length + 1 && 
        index !== words.length - 1 && !reverse ) {
      setReverse(true);
      return;
    }

    // keeps going to if sub index is 0
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => prev + 1);
      return;
    }

    // time delay between reverse and typing itself
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? 400 :
                150, parseInt(Math.random() * 150)));
  
    return () => clearTimeout(timeout);
}, [subIndex, index, reverse]);

  // blinker and time delay
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 650);
    return () => clearTimeout(timeout2);
  }, [blink]);

    const clickHandler = (e) => {
      showLoader();
    // Using cors-anywhere proxy to scrape the data on wikipedia
    fetch("https://blooming-river-52363.herokuapp.com/https://us-central1-sachacks-305315.cloudfunctions.net/pickabox-space")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data, typeof data);
        setArticleData(data.articles);
        setSubTitles('');
        hideLoader();
        setReshuffle(false);
      });

    
  };

  const titleClick =(link) =>{
    window.open(link);
    window.focus();
  }

  const reDigHandler = (id) =>{
    showLoader();
      fetch("https://blooming-river-52363.herokuapp.com/https://us-central1-sachacks-305315.cloudfunctions.net/pickabox-space?id=" + id)
        .then((resp) => resp.json())
        .then((data) => {
          setArticleData(data.articles);
          hideLoader();
    });
  }
  
  const digHandler = (title, id, link) => {
    return (event) => {
      console.log('I am fetching this link', title);
      showLoader();
      fetch("https://blooming-river-52363.herokuapp.com/https://us-central1-sachacks-305315.cloudfunctions.net/pickabox-space?id=" + id)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data, typeof data);
          setArticleData(data.articles);
          setSubTitles("Article: " + title);
          setId(id);
          setTitleLink(link);
          setReshuffle(true);
          hideLoader();
      });
    }
  }


  // const aboutHandler = () => {
  //   return (event) => {
  //     this.showModal();

  //   }
  // }

  // state = {
  //   show: false
  // };
  // showModal = e => {
  //   this.setState({
  //     show: true
  //   });
  // };

  const renderBox = (box, index) => {
    return(
      <InfoBox data={box} key={index} dig={digHandler}></InfoBox>
    )
  }
  return (
    <div className="App">

      <Grid container spacing={3} xs={12} justify="flex-end" >
        <Grid item xs={12} sm={3}>
          <img style={pageIcon} src={logo} alt="Logo" />
        </Grid>
        <Grid item container xs={12} sm={9} >
          <Grid item xs={12} style={pageTitle}>
          {`${words[index].substring(0, subIndex)}${blink ? "|" : " "}`}
          </Grid>
          
          <Grid item xs={12} style={subTitleStyle} onClick={() => titleClick(titleLink)} className='subTitle'>{subTitle}</Grid>
        </Grid>
        <Grid item container xs={12} sm={2} style={{position: 'relative'}}>
          <Grid item xs={12} style={pageIntro}> 
            
            <Button variant="primary" size="lg" onClick={clickHandler} style={restartButton} className='restartButton'>
             <strong>Shuffle</strong>
            </Button>
            <br/>
            {reShuffle ? <Button onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} variant="primary" size="lg" onClick={() => reDigHandler(titleId)} style={restartButton} className='restartButton'>
                            <strong>Re-Shuffle</strong>
                          </Button> : null}

                        {isShown && (
                    <div style={{textAlign: 'center'}}>
                      <p><em>Shuffles within this article.</em></p>
                    </div>
                  )}

            <br></br>
            <Button variant="primary" size="lg" onClick={setAboutModalIsOpenToTrue} style={restartButton} className='restartButton'>
              <strong>About</strong>
            </Button>

            <Modal isOpen={modalIsOpen}>
                <button onClick={setAboutModalIsOpenToFalse}>x</button>
                <AboutModal/>
            </Modal>
          </Grid>
          <br/>
          
          
        </Grid>
        <Grid container item xs={12} sm={10} spacing={4} justify="flex-end" style={boxGrid}>
            {articleData && articleData.map(renderBox)}
        </Grid>
        <Grid style={footer} item xs={12}>
            <h3>Created by <a target="_blank" href="https://github.com/kristofgazso/pickabox.space">The HAKeRs</a></h3>
        </Grid>
      </Grid>
      {loader}
    </div>
  );
}


const footer = {
  fontWeight:'bold',
  fontSize: '12px',
  height:'50px',
  bottom: '10px',
  position: 'relative',
}

const subTitleStyle={
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '35px',
  lineHeight: 'normal',
  marginBottom: '10px',
  cursor: 'pointer',
  /* or 71% */

  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
  color: '#000000',
  justifyContent: 'center',
}
const pageTitle={
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '48px',
  lineHeight: 'normal',
  marginTop: '20px',
  margin:'auto',
  justifyContent: 'center',
  marginTop: '5px',
  marginBottom: '10px',
  /* or 71% */

  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',

  color: '#000000'
}

const pageIcon={
  margin: '10px',
  height: '100px',
  width:'auto',
  left: '30px',
  float: 'left'
}
const pageIntro={
  textAlign: 'left',
}

const restartButton={
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px 16px',

  // position: 'absolute',
  width: '133px',
  height: '34px',
  cursor:'pointer',

  background: '#2565AE',
  borderRadius: '5px',
  borderColor: 'transparent',
  color: '#fff',
  transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
  margin: 'auto',
}

const boxGrid={
  border: '5px',
  margin: '0px'
}
