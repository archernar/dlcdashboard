import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Date;
import java.text.SimpleDateFormat;
import org.joda.time.*;

public class StopWatch {
     private long time_0 = 0L;

     StopWatch () {
          this.time_0 = (new java.util.Date()).getTime();
     }
     public long markTime() { 
          return ((new java.util.Date()).getTime() - this.time_0 );
     }
     public void reset() { 
          this.time_0 = (new java.util.Date()).getTime();
     }
     public String markTimeString() { 
          String szTime = Long.toString( (new java.util.Date()).getTime() - this.time_0 );
          return (szTime);
     }


}

