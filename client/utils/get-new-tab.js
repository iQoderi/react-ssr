import tabs from '../config/tab';
const getNewTab = (data)=>{
  data.map((topic)=> {
    topic.content = "";
    if (topic.top) {
      topic.newTab = tabs['top'];
    } else if (topic.good && !topic.top) {
      topic.newTab = tabs['good']
    } else {
      topic.newTab = tabs[topic.tab] || '未知';
    }
  });
}

export default getNewTab;
