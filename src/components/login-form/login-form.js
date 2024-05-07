import React, { useState, useRef, useCallback } from 'react';

import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
  EmailRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import './login-form.scss';
import { useAuth } from '../../contexts/auth';
import Assist from '../../assist.js';

function Login() {

  const [loading, setLoading] = useState(false);
  const formData = useRef({});
  const { signIn } = useAuth();

  const onSubmit = useCallback(async (e) => {

    e.preventDefault();

    const { email, password } = formData.current;

    setLoading(true);

    const res = await signIn(email, password);

    setLoading(false);

    if (!res.Succeeded) {

      notify(res.Message, 'error', 2000);

    } else {

      //record the login
      Assist.addLogin(email, 'Web').then((res) => {

        Assist.log(res.Message, "info");

      }).catch((x) => {
        
        Assist.log(x.Message, "warn");
      });

    }

  }, [signIn]);

  /*
  const onCreateAccountClick = useCallback(() => {
    history.push('/create-account');
  }, [history]);*/

  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <div style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', marginBottom: '20px' }}>
        <img src='twyshe.png' style={{ width: '120px', height: 'auto' }} alt='Twyshe Logo' />
      </div>
      <Form formData={formData.current} disabled={loading}>

        <Item
          dataField={'email'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="Email is required" />
          <EmailRule message="Email is invalid" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'password'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="Password is required" />
          <Label visible={false} />
        </Item>
        <ButtonItem>
          <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >
            <span className="dx-button-text">
              {
                loading
                  ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                  : 'Sign In'
              }
            </span>
          </ButtonOptions>
        </ButtonItem>
      </Form>
    </form>
  );
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Email', mode: 'email' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
/* const rememberMeEditorOptions = { text: 'Remember me', elementAttr: { class: 'form-text' } };*/


export default Login;