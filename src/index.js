import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Pager from 'react-subpage';


class FooTest
{
  get element(){ return 42; }
  blahc(){ return 234; }
}


const link = (text, pager, page, props) => {
  const url = pager.toUrl(page, props);
  const act = e=>{
    e.preventDefault();
    pager.push(page,props);
  }
  return  <a href={url} onClick={act}>{text}</a>
}
const foo_bar = {foo:'bar'};

const uri = (pager, uri)=><button onClick={e=>pager.push(uri)}>{uri}</button>

//=============================================================================

const MockHistory = ()=>{
  var history = pager.history;
  if(!history.mocking)
    return null;
  return (
    <div style={{backgroundColor:'red'}}>
      <b>MockHistory:</b>
      {
        history.entries.map((entry,index)=>(
            <button type='button' key={index} onClick={e=>history.go(index-history.index)}>
              <span style={{color:(index===history.index?'#f00':'#aaa')}}>
                {entry.url}
              </span>
            </button>
        ))
      }
      <input placeholder='Enter URL' size='8' onKeyDown={e=>{
        if(e.keyCode===13) history.enterUrl(e.target.value);
      }}/>
    </div>
  );
}

const urlMap = {};

const appInstanceId = new Date().toString();
const Test = ({children, title, pager})=>
  <div>
    <MockHistory/>
    <div style={{padding:'1em', border:'2px solid black'}}>
      <div style={{borderBottom:'1px solid black'}}>
        [ <a href="/"><b>react-subpage tests</b></a> ]
        - app init time: {appInstanceId}
      </div>
      <h1 style={{borderBottom:'1px solid black'}}>{title}</h1>
      {children}
      <div>{window.navigator.userAgent}</div>
    </div>
  </div>

//=============================================================================

const Test0 = ({pager})=>
  <Test title="react-subpage Browser Tests">
    <pre>{`  known issues --
      Safari 5.0 - pager.state not working, coz history.state is not supported.

      click hash url: <a href="#foo">
        not working on IE 9-11. (but OK on Edge) popstate not fired.
        https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/3740423/
        we won't fix it. app should use onClick().
    `}</pre>
    <p>
      This is a collection of tests of <b>react-subpage</b> package,
      intended to be carried out manually in browsers.
      They should be automated later.
    </p>
    <p>
      test various browsers: https://www.browserstack.com/#
    </p>
    <p>
      to test IE9: https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/
    </p>

    <hr/>
    <p>Try <a href='/mockHistory'>options.mockUrl='/test1'</a> </p>

    <div><hr/>{link('>> Test1', pager, Test1)}</div>
  </Test>
urlMap['/'] = Test0;

//=============================================================================

const Test1 = ({pager})=>
  <Test title="Initial URL">
    <p>
      When the app is loaded, the first page displayed should match
      the browser URL.
    </p>
    <p> (NO MOCK)
      Refresh the browser now, the app will be reloaded, and
      it should display this page instead of others.
    </p>
    <p> (NO MOCK)
      Another URL: click <a href="/test2">/test2</a>,
      or click it as bookmark, or manually enter it in URL bar.
      App should reload and init to that page.
    </p>
    <div><hr/>{link('>> Test2', pager, Test2)}</div>
  </Test>
urlMap['/test1'] = Test1;

//=============================================================================

const Test2 = ({pager})=>
  <Test title="pager.view()">
  <p>
    Calling <code>pager.view(page, props)</code> will replace
    the page without affecting history entries.
  </p>
  <button onClick={e=>pager.view(Test2B)}>pager.view(Test2B)</button>
  <button onClick={e=>pager.view(Test2B,foo_bar)}>pager.view(Test2B,foo_bar)</button>
  <div><hr/>{link('>> Test3', pager, Test3)}</div>
  </Test>
urlMap['/test2'] = Test2;

const Test2B = ({pager,foo})=>
  <div>
    <MockHistory/>
    <p>This is Test2B page. The current history entry is still /test2.</p>
    <p>On BACK button, should see Test1, not previous Test2 view.</p>
    <p>Switch to Test2 view: <button onClick={e=>pager.view(Test2)}>pager.view(Test2)</button></p>
    <p>foo={String(foo)}</p>
    <p>Try browser back/fwd or refresh. Should see Test2 view, not Test2B.</p>

  </div>

//=============================================================================

const Test3 = ({pager,foo})=>
  <Test title="pager.url; pager.toUrl(page,props)">
  <p>Test3 URL pattern: <code>/test3/:foo?</code></p>
  <p>foo={String(foo)}</p>
  <hr/>
  <p><code>pager.url</code> returns the current url - {pager.url} </p>
  <p>try: {['/test3/bar', '/test3/bar/', '/test3?', '/test3/?', '/test3/?#']
          .map(url=>uri(pager,url))}</p>
  <hr/>
  <p>
    <code>pager.toUrl(page,props)</code> returns a URL string for the page.
  </p>
  <p><code>pager.toUrl(Test3)</code> - {pager.toUrl(Test3)}</p>
  <p><code>pager.toUrl(Test3,foo_bar)</code> - {pager.toUrl(Test3,foo_bar)}</p>
  <p><code>pager.toUrl(Test3,bar_foo)</code> - {pager.toUrl(Test3,{bar:'foo'})}</p>
  <div><hr/>{link('>> Test4', pager, Test4)}</div>
  </Test>
urlMap['/test3/:foo?'] = Test3;

//=============================================================================

const Test4 = ({pager})=>
  <Test title="pager.push()">
  <p>
    pager.push(page,props) or pager.push(url)
    add a new history entry after this one.
    Later entries are cleared.
  </p>
  <p>
    click push(), then back, back, fwd, fwd, back.
  </p>
  <div><button onClick={e=>pager.push(Test4B)}>pager.push(Test4B)</button></div>
  <div><button onClick={e=>pager.push('/test4B')}>pager.push('/test4B')</button></div>
  <p>
    go to some <a href="http://example.com">other pages</a>,
    create several history entries, then go back to this page.
    now do push() again, those entries should be cleared.
  </p>
  <div><hr/>{link('>> Test5', pager, Test5)}</div>
  </Test>
urlMap['/test4'] = Test4;

const Test4B = ({pager})=>
  <div><MockHistory/> This is Test4B page</div>
urlMap['/test4B'] = Test4B;

//=============================================================================

const Test5 = ({pager})=>
  <Test title="pager.replace()">
  <p>
    pager.replace(page,props) or pager.replace(url)
    replace current history entry, without affecting other entries.
  </p>
  <p>
    click replace(), back, fwd, should see the replaced page.
  </p>
  <div><button onClick={e=>pager.replace(Test5B)}>pager.replace(Test5B)</button></div>
  <div><button onClick={e=>pager.replace('/test5B')}>pager.replace('/test5B')</button></div>
  <p>
    go to some <a href="http://example.com">other pages</a>,
    create several history entries, then go back to this page.
    now do replace() again, those entries should not be affected.
  </p>
  <div><hr/>{link('>> Test6', pager, Test6)}</div>
  </Test>
urlMap['/test5'] = Test5;

const Test5B = ({pager})=>
  <div>
    <MockHistory/>
    <p>This is Test5B page.</p>
    <div><button onClick={e=>pager.replace(Test5)}>pager.replace(Test5)</button></div>
  </div>
  urlMap['/test5B'] = Test5B;

//=============================================================================

const Test6 = ({pager})=>
  <Test title="accumulative push/replace">
  <p>
    <button onClick={e=>{
        pager.push(Test6B);pager.replace(Test6C);pager.push(Test6D);
    }}>push(Test6B);replace(Test6C);push(Test6D);</button>
    <br/>click the button, we should have 2 history entries created: test6C test6D
    <br/>we should see Test6D page;
    <br/>BACK button should see Test6C page.
  </p>
  <div><hr/>{link('>> Test7', pager, Test7)}</div>
  </Test>
urlMap['/test6'] = Test6;

const Test6B = ()=><div><MockHistory/><h1>Test 6 B</h1></div> ;
const Test6C = ()=><div><MockHistory/><h1>Test 6 C</h1></div> ;
const Test6D = ()=><div><MockHistory/><h1>Test 6 D</h1></div> ;
urlMap['/test6B'] = Test6B;
urlMap['/test6C'] = Test6C;
urlMap['/test6D'] = Test6D;

//=============================================================================

const Test7 = ({pager, onRequestTime})=>
  <Test title="pager.go(delta)">
  <p>
    go back/forward some pages.
  </p>
  <p>
    go to some <a href="http://example.com">other pages</a>,
    to create several history entries.
  </p>
  <p></p>
  <p>
    <button onClick={e=>pager.go(-1)}>go(-1)</button>
    <button onClick={e=>pager.go(-2)}>go(-2)</button>
  </p>
  <p>
    <button onClick={e=>pager.go(+1)}>go(+1)</button>
    <button onClick={e=>pager.go(+2)}>go(+2)</button>
    - add some history entries first. <a href="http://example.com">example.com</a>
  </p>
  <p>
    <button onClick={e=>pager.go(0)}>go(0)</button>
    - "refresh". will re-trigger onRequest() @ {onRequestTime}
  </p>
  <p>
    <button onClick={e=>pager.go(-100)}>go(-100)</button>
    <button onClick={e=>pager.go(100)}>go(+100)</button>
    - out of range, should have no effect
  </p>
  <div><hr/>{link('>> Test8', pager, Test8)}</div>
  </Test>
urlMap['/test7'] = Test7;

Test7.onRequest=(page,props,pager)=>{
  props={onRequestTime:new Date().toString()};
  return pager.view(page, props);
}

//=============================================================================

const Test8 = ({pager, onRequestTime})=>
  <Test title="onRequest()">
  <p>
    onRequest(page,props,pager) handler
    by default do <code>pager.view(page,props)</code> .
    If user defined, it can also do replace() or push().
  </p>
  <p>onRequest() of this page depends on request prop `flag`:</p>
  <p>if {uri(pager, '/test8/1')} flag=1, replace(Test8B); </p>
  <p>if {uri(pager, '/test8/2')} flag=2, push(Test8B); // hard to BACK!</p>
  <p>else view(Test8); // this page</p>
  <p>
    onRequest() is triggered everytime the entry is revisited.
    try back/fwd, and examine onRequestTime: <b>{onRequestTime}</b>
  </p>
  <div><hr/>{link('>> Test9', pager, Test9)}</div>
  </Test>
urlMap['/test8/:flag?'] = Test8;
Test8.onRequest = (page,{flag},pager)=>{
  const props={onRequestTime:new Date().toString()};
  if(flag==='1')
    return pager.replace(Test8B,props);
  else if(flag==='2')
    return pager.push(Test8B,props);
  else
    return pager.view(page, props);
}

const Test8B = ({pager,onRequestTime}) =>
  <div>
    <MockHistory/>
    <p>
      This is Test8B.
      onRequestTime: <b>{onRequestTime}</b>
    </p>
    <p>
      go somewhere else: <a href="http://example.com">example.com</a>
    </p>
  </div>
urlMap['/test8B'] = Test8B;

//=============================================================================

const Test9 = ({pager})=>
  <Test title="pager.state">
  <p>
    get pager.state: <b>{String(pager.state)}</b>
  </p>
  <p>
    set pager.state: <input onKeyDown={e=>{
      if(e.keyCode===13){
        pager.state = e.target.value;
        pager.go(0);
      }
    }}/> (ENTER to set state)
  </p>
  <p>
    Try back/fwd, should see the latest set state.
  </p>
  <p>
    Try goto another <a href="http://example.com">doc</a>; this app will be unloaded.
    Then BACK to this entry; this app will be reloaded; the state should persist.
  </p>
  <p>
    REFRESH / F5 this page. App reloads. The state persists.(?)
  </p>
  <p>
    Try <button onClick={e=>pager.go(0)}>pager.go(0)</button>
    - the state persists.
  </p>
  <p>
    Try <button onClick={e=>pager.replace(Test9)}>pager.replace(Test9)</button>
    - the state is LOST. (desired behavior for most replace() use cases)
  </p>
  <p>
    Try <button onClick={e=>{
      const s = pager.state;
      pager.replace(Test9);
      pager.state = s;
    }}>replace() with save/restore state</button>
    - the state persists.
  </p>
  <div><hr/>{link('>> Test10', pager, Test10)}</div>
  </Test>
urlMap['/test9'] = Test9;

//=============================================================================

const Test10 = ({pager})=>
  <Test title="Hash">
  <p>
    URL patterns can be in either path or hash.
    App can mix both; tho usually only one is picked.
  </p>
  <p>pager.push:</p>
  <p>{link('test 10 B', pager, Test10B)}</p>
  <p>{link('test 10 C', pager, Test10C, {foo:'bar'})}</p>
  <p>(NO MOCK) simple anchor</p>
  <p><a href="#B">#B</a></p>
  <p><a href="/test10#C/bar">/test10#C/bar</a></p>
  <div><hr/>{link('>> TestX', pager, TestX)}</div>
  </Test>
urlMap['/test10'] = Test10;

const Test10B = ()=>
  <div><MockHistory/>This is Test 10 B page</div>
urlMap['/test10#B']=Test10B;
const Test10C = ({foo})=>
  <div><MockHistory/>This is Test 10 C page. foo={String(foo)}</div>
urlMap['/test10#C/:foo']=Test10C;

//=============================================================================

const TestX = ({pager})=>
  <Test title="Test X">
  <p>
    No more tests.
  </p>
  <div><hr/>{link('>> TestX', pager, TestX)}</div>
  </Test>
urlMap['/testX'] = TestX;

//=============================================================================

const NotFound = ({url, pager})=>
  <Test title={`Not Found ${url}`}>
    <div>
      <p>URL not mapped: <b>{url}</b></p>
    </div>
  </Test>
urlMap[':url(.*)'] = NotFound;
//-- alt:
//-- NotFound.onRequest() redirects to somewhere else
// urlMap['*'] = ()=>null;
// urlMap['*'].onRequest = (pg,pr,pager)=>pager.replace('/');

//=============================================================================

const options = {};

if(location.pathname==='/mockHistory')
  options.mockUrl = '/test1';

const pager = new Pager(urlMap, options);

//pager.depend = {foo:'bar'};


ReactDOM.render(
  pager.element,
  document.getElementById('root')
);
