/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../intro/style.css';
import { BUTTON, H1 } from '../../../styles/MyInfoStyle';
import {STYLEDBUTTON,STYLEDCONTAINER,STYLEDCONTAINER2,BLACKBUTTON,PINKBUTTON, PAGEHEADER} from '../../../styles/ClassStyle'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import moment from 'moment';
import './Cal.css';
import UserContext from '../../../userContext';

const divStyle = {
  display:'grid', 
  gridTemplateColumns: 'repeat(4, 1fr)',
  borderBottom:"solid 1px gray",
  textAlign: "center",
  padding: '0.5em 0'
}

function ClassAppointmentPage() {
  const { userId } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [clsNo, setClsNo] = useState(0);
  const [passNo, setPassNo] = useState(0);
  const handleShow = () => setShow(true);
  const [smShow, setSmShow] = useState(false);
  const [value, onChange] = useState(new Date());

  const [classList, setClassList] = useState([]);

  console.log(moment(value).format("YYYY-MM-DD"))//달력에서 선택한 날짜 YYYY-MM-DD 형식에 맞게 변환하는 코드 테스트용으로 콘솔에 출력

  const todayClass = classList.filter(classItem => {
    return classItem.CLS_DATE === moment(value).format("YYYY-MM-DD")
  })//수업 목록 중에 달력에서 선택한 날짜와 날짜가 같은 수업만 todayClass라는 새 배열에 담음

  const handleSubmit = () => {
    setShow(false)
    fetch(`http://localhost:9000/class/apptInsert?cls_no=${clsNo}&pass_no=${passNo}`)
      .then(res => res.json())
      .then(result => console.log(result))
  }

  const todayClassElements = todayClass.map((item, index) => {
    console.log(item.CLS_MAXCNT, item.CLS_CNT)
    return (
      <div key={index} style={divStyle}>
        <p className="classParagraph">{item.CLS_TIME}</p>
        <p className="classParagraph">
          {
            item.CLS_TYPE === 0 ? "필라테스" :
            item.CLS_TYPE === 1 ? "요가" : "스피닝"
          }
        </p>
        <p className="classParagraph">{item.CLS_TNAME} 강사</p>
        {
          item.CLS_MAXCNT != item.CLS_CNT ?
          <STYLEDBUTTON onClick={() => {
            setShow(true)
            setClsNo(item.CLS_NO)
          }}>예약하기</STYLEDBUTTON> : <STYLEDBUTTON gray> 예약마감 </STYLEDBUTTON>
        }
        
      </div>
    )
  })

  useEffect(() => {
    fetch(`http://localhost:9000/pass/passList?mem_id=${userId}`)
      .then(res => res.json())
      .then(result => setPassNo(result[0].PASS_NO))
  }, [])

  useEffect(() => {
    fetch(`http://localhost:9000/class/classList?cls_status=0`)
      .then(res => res.json())
      .then(result => setClassList(result))
  }, [])

  return (
    <div className="app">
      <STYLEDCONTAINER relative>
        <PAGEHEADER>
          <H1>수업 예약</H1>
        </PAGEHEADER>
      <STYLEDCONTAINER2> 
        <div className="calendar">
          <span className="bold"></span>
          <Calendar 
          onChange={onChange} 
          value={value} 
          formatDay={(locale, date) => moment(date).format("DD")}
          />         
          <div className="SelectDate">
            <strong>{moment(value).format("YYYY년 MM월 DD일")}</strong>
          </div>
        </div>

        <div className="classBox">
          <div className="text-left">
            {todayClassElements}
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>수업 예약</Modal.Title>
            </Modal.Header>
            <Modal.Body>수업을 예약하시겠습니까?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                취소
              </Button>
              <BUTTON variant="primary" onClick={handleSubmit}>
                예약
              </BUTTON>
            </Modal.Footer>
          </Modal>
        </div>
      </STYLEDCONTAINER2> 
      </STYLEDCONTAINER>
    </div>
  

  );

}


export default ClassAppointmentPage;