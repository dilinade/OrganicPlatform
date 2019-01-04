import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {create,sendsms} from './api-user.js'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import {Link} from 'react-router-dom'
import ReactCodeInput from 'react-verification-code-input'

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.primary.main
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  }
})

class Signup extends Component {
  state = {
      name: '',
      password: '',
      confirm:'',
      phone:'',
      email: '',
      open: false,
      error: '',
      code:'',
      count:''
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }

  generatecode = () => {
      const min = 0;
      const max = 9;
      let rand;
      var num = "";
      for(var i=0;i<6;i++){
          rand = min + Math.random() * (max - min);
          num += Math.round(rand);
      }

      this.setState({ code: num },function () {
            console.log(this.state.code)
          const tt = {
                code:this.state.code,
                phone:"+"+this.state.phone
          }
          sendsms(tt)

      });
  }
 sendCode = () => {

    this.generatecode()

 }


 confirmCode = code => {
     const user = {
         name: this.state.name || undefined,
         email: this.state.email || undefined,
         password: this.state.password || undefined,
         confirm: this.state.confirm || undefined,
         phone: '+'+ this.state.phone || undefined
     }
     console.log(this.state.code)
      if(this.state.code==code){
          console.log("User created!")
              create(user).then((data) => {
                  if (data.error) {
                      this.setState({error: data.error})
                  } else {
                      this.props.history.push("/signin")
                  }
              })


      }
      else{
          this.setState({open:false,error:'Verification failed'})
      }


  }




  clickSubmit = () => {
    const user = {
      name: this.state.name || undefined,
      email: this.state.email || undefined,
      password: this.state.password || undefined,
      confirm: this.state.confirm || undefined,
      phone: '+'+ this.state.phone || undefined
    }
    if (user.password !== user.confirm) {
        this.setState({error:'Password do not match'})
    } 
    if(user.phone.length !== 12){
       this.setState({error:'Invalid phone number length'})
    }
    else{
        this.setState({error: '', open: true})


        }
  }

  render() {
    const {classes} = this.props
    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Sign Up
          </Typography>
          <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={this.handleChange('name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} margin="normal"/><br/>
          <TextField id="phone" type = "Number" label="Mobile Number (94)" className={classes.textField} value={this.state.phone} onChange={this.handleChange('phone')} margin="normal" maxLength="11"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} margin="normal"/>
          <TextField id="confirm" type="password" label="Confirm Password" className={classes.textField} value={this.state.confirm} onChange={this.handleChange('confirm')} margin="normal"/>
          <br/> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
        <Dialog open={this.state.open} disableBackdropClick={false} >
            <DialogTitle className={classes.title}>Verify Phone Number</DialogTitle>
            <DialogContent>
                <ReactCodeInput onComplete={this.confirmCode}/>
                <br/>
            </DialogContent>
            <DialogActions>
                    <Button color="primary" autoFocus="autoFocus" variant="raised" onClick={this.sendCode}>
                        Send Code
                    </Button>
            </DialogActions>
        </Dialog>
      {/*<Dialog open={this.state.open} disableBackdropClick={true}>*/}
        {/*<DialogTitle>New Account</DialogTitle>*/}
        {/*<DialogContent>*/}
          {/*<DialogContentText>*/}
            {/*New account successfully created.*/}
          {/*</DialogContentText>*/}
        {/*</DialogContent>*/}
        {/*<DialogActions>*/}
          {/*<Link to="/signin">*/}
            {/*<Button color="primary" autoFocus="autoFocus" variant="raised">*/}
              {/*Sign-In*/}
            {/*</Button>*/}
          {/*</Link>*/}
        {/*</DialogActions>*/}
      {/*</Dialog>*/}
    </div>)
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signup)
