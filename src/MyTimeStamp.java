import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Date;
import java.text.SimpleDateFormat;
import org.joda.time.*;

public class MyTimeStamp {
     // http://www.xyzws.com/javafaq/how-to-use-simpledateformat-class-formating-parsing-date-and-time/142
     final DLCUtil dlcutil = new DLCUtil(true);
     String ts;
     long time_0 = 0L;
     String desc_0 = "";
     MyStringBuilder sbBuffer = new MyStringBuilder();

     //private static final String szFormatString = "MMddyyHH:mmZ";
     private static final String szFormatString = "MM-dd-yy";

     MyTimeStamp () {
          Date now = new java.util.Date();
          SimpleDateFormat format = new SimpleDateFormat(szFormatString);
          this.ts = format.format(now);
     }
     MyTimeStamp (String f) {
          Date now = new java.util.Date();
          SimpleDateFormat format = new SimpleDateFormat(f);
          this.ts = format.format(now);
     }
     MyTimeStamp (Date then) {
          if (then == null ) {
               this.ts = null;
          }
          else {
               SimpleDateFormat format = new SimpleDateFormat(szFormatString);
               this.ts = format.format(then);
          }
     }
     MyTimeStamp (Date then, String f) {
          if (then == null ) {
               this.ts = null;
          }
          else {
               SimpleDateFormat format = new SimpleDateFormat(f);
               this.ts = format.format(then);
          }
     }
     String getTimeStamp() {
          return(this.ts);
     }
     void logtime() {
          String f = "MM-dd-yy HH:mm:s.S Z";
          Date now = new java.util.Date();
          SimpleDateFormat format = new SimpleDateFormat(f);
          dlcutil.sysOut(format.format(now));
     }
     String markTime(String sz) { 
          this.desc_0 = sz;
          return(markTime());
     }
     void markTimeClearBuffer() { 
          sbBuffer.clear();
     }
     String markTimeBuffer() { 
          return(sbBuffer.toString());
     }
     String markTime() { 
          long ret = 0L;
          String sz = "";
          if ( this.time_0 == 0L ) {
               this.time_0 = (new java.util.Date()).getTime();
               sz = this.desc_0 + ": " + Long.toString(ret);
          }
          else {
               ret = (new java.util.Date()).getTime() - this.time_0;
               sz = dlcutil.padding(this.desc_0) + ": " + Long.toString(ret);
               this.time_0 = 0L;
          } 
          sbBuffer.append(sz + " ");
          return(sz);
     }
     void logtime(String sz) {
          String f = "MM-dd-yy HH:mm:s.S Z";
          Date now = new java.util.Date();
          SimpleDateFormat format = new SimpleDateFormat(f);
          dlcutil.sysOut(sz + ":" + format.format(now));
     }
   
     String nowuid() {
          String f = "'uid-'yyyymmdd't'hhmmss'.0z'";
          Date now = new java.util.Date();
          SimpleDateFormat format = new SimpleDateFormat(f);
          return(format.format(now));
     }
     String nowzulu() {
          String f = "yyyy-mm-dd't'hh:mm:ss'.0z'";
          Date now = new java.util.Date();
          SimpleDateFormat format = new SimpleDateFormat(f);
          return(format.format(now));
     }
     String now() {
          String f = "MM-dd-yy HH:mm:s.S Z";
          Date now = new java.util.Date();
          SimpleDateFormat format = new SimpleDateFormat(f);
          return(format.format(now));
     }
     String value() {
          return(this.ts);
     }
}

