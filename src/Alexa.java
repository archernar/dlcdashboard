import java.util.List;
import java.util.Arrays;

public class Alexa {
public Alexa() {
        super();
}

public String speak(String titleText, String mainText, String redirectionUrl) {
     DLCUtil u = new DLCUtil();
     MyStringBuilder sbAlexa = new MyStringBuilder();
     MyTimeStamp tsAlexa = new MyTimeStamp();
     sbAlexa.appendln("{");
     sbAlexa.appendln(u.dqcolon("uid")  + u.dqcomma(tsAlexa.nowuid()));
     sbAlexa.appendln(u.dqcolon("updateDate")  + u.dqcomma(tsAlexa.nowzulu()));
     sbAlexa.appendln(u.dqcolon("titleText")  + u.dqcomma(titleText));
     sbAlexa.appendln(u.dqcolon("mainText")  + u.dqcomma(mainText));
     sbAlexa.appendln(u.dqcolon("redirectionUrl")  + u.dq(redirectionUrl));
     sbAlexa.appendln("}");
     return sbAlexa.toString();
}



}
